class Chatbox {
    constructor() {
       // debugger;
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button'),
            chatboxCloseButton: document.querySelector('.chatbot_close')
        }

        this.state = false;
        this.messages = [];
    }

    display() {
       // debugger;
        const {openButton, chatBox, sendButton, chatboxCloseButton} = this.args;

        openButton.addEventListener('click', () => this.onChatboxOpenClick(chatBox, openButton))
        sendButton.addEventListener('click', () => this.onSendButton(chatBox))
        chatboxCloseButton.addEventListener('click', () => this.onChatboxCloseClick(chatBox, openButton))

        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({key}) => {
            if (key === "Enter") {
                this.onSendButton(chatBox)
            }
        })
    }

    onChatboxOpenClick(chatbox, openButton) {
        // show the box
        chatbox.classList.add('chatbox--active')
        openButton.style.display = 'none'
    }

    onSendButton(chatbox) {
        var textField = chatbox.querySelector('input');
        let text1 = textField.value
        if (text1 === "") {
            return;
        }

        let msg1 = { name: "User", message: text1 }
        this.messages.push(msg1);

        fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            body: JSON.stringify({ message: text1 }),
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
          })
          .then(r => r.json())
          .then(r => {
            let msg2 = { name: "Sam", message: r.answer };
            this.messages.push(msg2);
            this.updateChatText(chatbox)
            textField.value = ''

        }).catch((error) => {
            console.error('Error:', error);
            this.updateChatText(chatbox)
            textField.value = ''
          });
    }

    updateChatText(chatbox) {
        var html = '';
        this.messages.slice().reverse().forEach(function(item, index) {
            if (item.name === "Sam")
            {
                html +=  `<div class="messages__item messages__item--visitor">'
                                <img src="./Images/ChatBot_Icon.png" alt="avatar" height="40px" width="40px" style = "margin-right: 5px">
                                <div><p>${item.message}</p></div>
                            </div>`
            }
            else
            {
                html +=  `<div class="messages__item messages__item--operator">'
                                <img src="./Images/userImage.png" alt="avatar" height="40px" width="40px" style = "margin-right: 5px">
                                <div><p>${item.message}</p></div>
                            </div>`
            }
          });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }

    onChatboxCloseClick(chatbox, openButton){
        //hide the box
        chatbox.classList.remove('chatbox--active');
        openButton.style.display = 'block'
    }
}


const chatbox = new Chatbox();
chatbox.display();