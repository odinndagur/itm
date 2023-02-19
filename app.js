'use strict';

async function initReact(){
    if(!window.db){
        setTimeout(function(){
            initReact()
        },150)
        return
    }
    window.db.query('select * from sign').then(signs => {
        const e = React.createElement;
        
        class LikeButton extends React.Component {
          constructor(props) {
            super(props);
            this.state = { liked: false, signs: signs };
          }
        
          render() {
            if (this.state.liked) {
              return 'You liked this.';
            }
        
            return (
                this.state.signs.map(sign => {
                    <span>sign.phrase</span>
                })
                // <button onClick={() => this.setState({ liked: true })}>
                //   Like
                // </button>
        
                // <div class="sign">
                //     <span class="sign-phrase">Ég hlýði víði</span>
                // </div>
              );
          }
        }
        const domContainer = document.querySelector('#app');
        const root = ReactDOM.createRoot(domContainer);
        root.render(e(LikeButton));
        
    })
}

initReact()