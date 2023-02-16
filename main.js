function init(){
        let params = {}
        window.location.search.substring(1).split('&').forEach(temp => {
            const [param, value] = temp.split('=')
            params[param] = value
        })
        updateSearch()
        
    }

    function createSignElement(sign){
        let related_signs = ''
        let sign_collections = ''
        if(sign.related_signs){
            related_signs = sign.related_signs.split(',').map(rel => {
                // const [phrase, id] = rel.split('_id_')
                return `<span class="related-sign-phrase"><a href="/itm">${rel}</a></span>`
            }).join('')
        }
        if(sign.collections){
            sign_collections = sign.collections.split(',').map(col=>{
                const [collection, id] = col.split('_id_')
                return `<span class="collection"><a href="/itm?collection_id=${id}">${collection}</a></span>`
            }).join('')
        }
        let el = document.createElement('div')
        el.classList.add('sign')
        el.onclick = ''
        el.innerHTML = `
        <div>
            <div class="sign-phrase">
                <a href="/itm?sign_id=${sign.id}">${sign.phrase}</a>
                <span class="sign-collections">${sign_collections}</span>
            </div>
            ${related_signs}
        </div>
        `
        return el
    }

    async function updateSearch(inputQuery){
        if(!window.db){
            setTimeout(function(){
                updateSearch(inputQuery)
            },150)
            return
        }
        let inp = document.querySelector('#search-input')
        let searchValue = inp.value
        // if(true){
        //     searchValue = searchValue + "*"
        // }
        let query
        if(inp.value == ""){
            query = `select * from sign order by phrase asc`
            // query = 'select * from sign order by phrase asc'
        }
        else {
            query = `select * from sign_fts join sign on sign_fts.id = sign.id where sign_phrase_fts match "${searchValue}*" order by rank, phrase asc`
            // query = `select * from sign where phrase like "%${searchValue}%" order by phrase asc`
        }
        if(inputQuery){
            query = inputQuery
        }
        let signs = await window.db.query(query)
        let searchResultsElement = document.querySelector('.search-results')
        searchResultsElement.innerHTML = signs.map(sign => {
            return `<div class="sign" onclick="showYoutube(this)" id="${sign.id}" youtube_id="${sign.youtube_id}">
            <div class="sign-phrase">
                <a href="/?sign_id=${sign.id}">${sign.phrase}</a>
            </div>
        </div>`
        }).join('')
        // for(let sign of signs){
        //     // console.log(sign)
        //     let el = createSignElement(sign)
        //     searchResultsElement.appendChild(el)
        // }
    }

    async function showYoutube(el){
        
        let removed = false
        for(let child of el.children){
            if(child.classList.contains('youtube')){
                console.log(child.classList)
                el.removeChild(child)
                removed = true
            }
        }
        if(!removed){
            // el.
            // sign = await db.query(`select * from sign where id = ${el.id}`)
            let yt_id = el.attributes['youtube_id'].nodeValue
            let youtubeElement = document.createElement('div')
            youtubeElement.setAttribute('max-width','50%')

            // Create a new iframe element
            const iframe = document.createElement("iframe");
            iframe.classList.add('youtube')
            iframe.setAttribute("width","90%")
            iframe.setAttribute("display", "block");
            iframe.style.maxWidth = "500px"
            iframe.style.aspectRatio = 1.5
            youtubeElement.style.padding = '0.5rem'
            // iframe.setAttribute("max-width","500px")
            // iframe.setAttribute("aspect-ratio", "0.667");

            iframe.setAttribute("src", `https://www.youtube.com/embed/${yt_id}`);
            youtubeElement.appendChild(iframe)



            el.appendChild(youtubeElement)
        }
        // console.log(el)
    }

    // <iframe width="560" height="315" src="https://www.youtube.com/embed/75MiNrJyx90" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>