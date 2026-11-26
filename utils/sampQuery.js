const dgram = require('dgram');
const iconv = require('iconv-lite');

class SAMPQuery {
    async getServerInfo(server) {
        return new Promise((resolve) => {
            const socket = dgram.createSocket('udp4');
            const packet = Buffer.alloc(11);
            packet.write('SAMP', 0);
            const ipOctets = server.ip.split('.').map(Number);
            for (let i = 0; i < 4; i++) packet[4 + i] = ipOctets[i];
            packet[8] = server.port & 0xff;
            packet[9] = (server.port >> 8) & 0xff;
            packet[10] = 'i'.charCodeAt(0);

            socket.on('message', (data) => {
                socket.close();
                if (data.length < 11) return resolve(null);
                const players = data.readUInt16LE(12);
                const maxplayers = data.readUInt16LE(14);
                const hostnameLen = data.readUInt32LE(16);
                const hostname = iconv.decode(data.subarray(20, 20 + hostnameLen), 'utf8').trim();
                resolve({ players, maxplayers, hostname });
            });
            socket.on('error', () => resolve(null));
            socket.send(packet, server.port, server.ip);
            setTimeout(() => { socket.close(); resolve(null); }, 5000);
        });
    }
}
module.exports = { SAMPQuery };
