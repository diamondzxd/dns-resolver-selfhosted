const dgram = require('node:dgram')

const server = dgram.createSocket('udp4')
const dnsPacket = require('dns-packet')

const db = {
    'piyush.ovh' : {
        type : 'A',
        data: '12.125.1.25'
    },
    'test.piyush.ovh' : {
        type: 'A',
        data: '52.51.25.1'
    },
    'blog.piyush.ovh' : {
        type: 'CNAME',
        data: 'blog.hashnode.com'
    }
}

server.on('message', (msg, rinfo) =>  {
    const incomingReq = dnsPacket.decode(msg)
    ipFromDB = db[incomingReq.questions[0].name]
    
    const ans = dnsPacket.encode({
        type: 'response',
        id: incomingReq.id,
        flags: dnsPacket.AUTHORITATIVE_ANSWER,
        questions: incomingReq.questions,
        answers: [{
            type: ipFromDB.type,
            class: 'IN',
            name: incomingReq.questions[0].name,
            data: ipFromDB.data
        }]
    })

    server.send(ans, rinfo.port, rinfo.address)
})

server.bind(53, () => {
    console.log('DNS Server is running on port 53...')
})