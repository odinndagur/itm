function init(){
        let params = {}
        window.location.search.substring(1).split('&').forEach(temp => {
            const [param, value] = temp.split('=')
            params[param] = value
        })
        if(params.sign_id){
            updateSearch(`select sign.phrase, sign.id, group_concat(related.phrase || '_id_' || related.id) as related_signs from sign join sign_related on sign_related.sign_id = sign.id join sign as related on sign_related.related_id = related.id where sign.id =${params.sign_id}`)
        }
        else{
            updateSearch()
        }
    }

    function createSignElement(sign){
        let related_signs = ''
        let sign_collections = ''
        if(sign.related_signs){
            related_signs = sign.related_signs.split(',').map(rel => {
                const [phrase, id] = rel.split('_id_')
                return `<span class="related-sign-phrase"><a href="/?sign_id=${id}">${phrase}</a></span>`
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
            // query = `select * from sign_fts order by phrase asc`
            query = 'select * from sign order by phrase asc'
        }
        else {
            // query = `select * from sign_phrase_fts where sign_phrase_fts match "${searchValue}" order by rank, phrase asc`
            query = `select * from sign where phrase like "%${searchValue}%" order by phrase asc`
        }
        if(inputQuery){
            query = inputQuery
        }
        let signs = await window.db.query(query)
        let searchResultsElement = document.querySelector('.search-results')
        searchResultsElement.innerHTML = ''
        for(let sign of signs){
            // console.log(sign)
            let el = createSignElement(sign)
            searchResultsElement.appendChild(el)
        }
    }