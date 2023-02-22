function init(){
    if(!window.db){
        setTimeout(function(){
            init()
        },150)
        return
    }
    let params = {}
    window.location.search.substring(1).split('&').forEach(temp => {
        const [param, value] = temp.split('=')
        params[param] = value
    })

    updateSearch()

    window.addEventListener('scroll', () => {
        let bottomOfWindow = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop) + window.innerHeight === document.documentElement.offsetHeight
        if (bottomOfWindow) {
            hitWindowBottom()
            }
    })
        
    }


async function updateSearch(inputQuery){
    // if(!window.db){
    //     setTimeout(function(){
    //         init()
    //     },150)
    //     return
    // }
    let userCollectionSigns = JSON.parse(window.localStorage.getItem('userCollectionSigns')) || []
    let inp = document.querySelector('#search-input')
    let searchValue = inp.value
    let query
    if(!searchValue){
        query = `select * from sign order by phrase asc limit ${signCount}`
        // query = 'select * from sign order by phrase asc'
    } if (searchValue[0] === '*'){
        query = `select * from sign where phrase like "%${searchValue.substring(1)}%" order by phrase asc`
    } 
    if(searchValue && searchValue[0] != '*') {
        query = `select * from sign_fts join sign on sign_fts.id = sign.id where sign_fts match "${searchValue}*" order by rank, phrase asc`
        // query = `select * from sign where id in (
        //     select id from sign_fts where sign_fts match "${searchValue}*" order by rank
        // )`
        // query = `select * from sign where phrase like "%${searchValue}%" order by phrase asc`
    }
    if(inputQuery){
        query = inputQuery
    }
    console.log('query: ',query, 
                'search value: ', searchValue,
                'search value === ""', searchValue === "")
    let signs = await window.db.query(query)
    let searchResultsElement = document.querySelector('.search-results')
    searchResultsElement.innerHTML = signs.map(sign => {
        return `<div class="sign" onclick="showYoutube(this)" id="${sign.id}" youtube_id="${sign.youtube_id}">
                    <div class="sign-phrase">
                        <span>${sign.phrase}</span>
                        <span class="addToListIcon" onclick="addToList(${sign.id})">
                        <i class="material-icons">${userCollectionSigns.includes(sign.id) ? 'playlist_add_check' : 'playlist_add'}</i></span>
                    </div>
                </div>`
    }).join('')

}

async function showYoutube(el){       
    let removed = false
    for(let child of el.children){
        if(child.classList.contains('sign-video')){
            console.log(child.classList)
            el.removeChild(child)
            removed = true
        }
    }
    if(!removed){
        let yt_id = el.attributes['youtube_id'].nodeValue
        let youtubeElement = document.createElement('div')
        youtubeElement.classList.add('sign-video')
        youtubeElement.setAttribute("display", "inline-block");
        youtubeEmbedUrl = `https://www.youtube.com/embed/${yt_id}?autoplay=1&loop=1&rel=0&controls=0&mute=1&playsinline=0&playlist=${yt_id}`
        fetch(youtubeEmbedUrl, {mode:'no-cors'}).then(res => {
            const iframe = document.createElement("iframe");
            iframe.setAttribute("src", youtubeEmbedUrl);
            iframe.allowFullscreen = true;
            youtubeElement.appendChild(iframe)
        })
        el.appendChild(youtubeElement)

    }
}

const isElementLoaded = async selector => {
    while ( document.querySelector(selector) === null) {
      await new Promise( resolve =>  requestAnimationFrame(resolve) )
    }
    return document.querySelector(selector);
  };

function addToList(id){
    // console.log(id)
    let userCollectionSigns = JSON.parse(window.localStorage.getItem('userCollectionSigns')) || []
    // if(userCollectionSigns){
    //     userCollectionSigns = JSON.parse(userCollectionSigns)
    // } else {
    //     userCollectionSigns = []
    // }
    if(!userCollectionSigns.includes(id)){
        userCollectionSigns.push(id)
        document.getElementById(`${id}`).outerHTML = document.getElementById(`${id}`).outerHTML.replace('playlist_add','playlist_add_check')
    }
    window.localStorage.setItem('userCollectionSigns', JSON.stringify(userCollectionSigns))
    window.event.stopPropagation()

}

