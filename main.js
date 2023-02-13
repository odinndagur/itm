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
                return `<span class="related-sign-phrase"><a href="/">${rel}</a></span>`
            }).join('')
        }
        if(sign.collections){
            sign_collections = sign.collections.split(',').map(col=>{
                const [collection, id] = col.split('_id_')
                return `<span class="collection"><a href="/?collection_id=${id}">${collection}</a></span>`
            }).join('')
        }
        let el = document.createElement('div')
        el.classList.add('sign')
        el.onclick = ''
        el.innerHTML = `
        <div>
            <div class="sign-phrase">
                <a href="/?sign_id=${sign.id}">${sign.phrase}</a>
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
            query = `select * from sign_fts order by phrase asc`
            // query = 'select * from sign order by phrase asc'
        }
        else {
            query = `select * from sign_phrase_fts where sign_phrase_fts match "${searchValue}*" order by rank, phrase asc`
            // query = `select * from sign where phrase like "%${searchValue}%" order by phrase asc`
        }
        if(inputQuery){
            query = inputQuery
        }
        let signs = await window.db.query(query)
        let searchResultsElement = document.querySelector('.search-results')
        searchResultsElement.innerHTML = signs.map(sign => {
            return `<div class="sign">
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