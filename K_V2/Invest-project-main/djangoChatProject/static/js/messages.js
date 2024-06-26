let input_message = $('#input-message')
let message_body = $('.msg_card_body')
let send_message_form = $('#send-message-form')
const USER_ID = $('#logged-in-user').val()

let loc = window.location
let wsStart = 'ws://'

if(loc.protocol === 'https') {
    wsStart = 'wss://'
}
let endpoint = wsStart + loc.host + loc.pathname

var socket = new WebSocket(endpoint)


socket.onopen = async function(e) {
    console.log('open', e)

    send_message_form.on('submit', function (e){
        e.preventDefault()
        let message = input_message.val()
        let send_to;
        if(USER_ID == 1)
            send_to = 2
        else
            send_to = 1
        let data = {
            'message': message,
            'sent_by': USER_ID,
            'send_to': send_to
        }
        data = JSON.stringify(data)
        socket.send(data)
        $(this)[0].reset()
    })
}


socket.onmessage = async function(e) {
    console.log('message', e)
    let data = JSON.parse(e.data)
    let message = data['message']
    let sent_by_id = data['sent_by']
    newMessage(message, sent_by_id)
}


socket.onerror = async function(e){
    console.log('error', e)
}


socket.onclose = async function(e){
    console.log('close', e)
}


function newMessage(message, sent_by_id){
    if ($.trim(message) === '') {
		return false;
	}
    let message_element
    let date = new Date().toString().split(' ')
    let timenow = date[4].substring(0,5)
    if(sent_by_id == USER_ID){
        message_element = `
			<div class="d-flex mb-4 replied">
				<div class="msg_cotainer_send">
					${message}
					<span class="msg_time_send">${timenow} ${date[1]} ${date[2]}</span>
				</div>
			</div>
	    `
    }
    else{
        message_element = `
            <div class="d-flex mb-4 received">
                <div class="msg_cotainer">
                    ${message}
                    <span class="msg_time">${timenow} ${date[1]} ${date[2]}</span>
                </div>
            </div>
        `
        // ${date.getHours()}:${date.getMinutes()} , ${date.getDay()}.${date.getMonth()}.${date.getFullYear()}
    }

    message_body.append($(message_element))
    message_body.animate({
        scrollTop: $(document).height()
    }, 100);
	input_message.val(null);
}

