const io = require('socket.io')(3000);

const arrUserInfo = [];

io.on('connection', socket => {
    socket.on('NGUOI_DUNG_DANG_KY', function(user){
        //kiem tra ten da ton tai chua
        const isExist = arrUserInfo.some(e => e.ten === user.ten);
        if(isExist){
            return socket.emit('DANG_KY_THAT_BAI');
        }
        arrUserInfo.push(user);

        socket.emit('DANH_SACH_ONLINE', arrUserInfo);

        //thong bao cho tat ca co nguoi dung moi tru ng moi vao
        socket.broadcast.emit('CO_NGUOI_DUNG_MOI', user);

        socket.peerId = user.peerId;
    });

    socket.on('disconnect', () => {
        const index = arrUserInfo.findIndex(user => {user.peerId === socket.peerId});
        arrUserInfo.splice(index, 1);
        io.emit('AI_DO_NGAT_KET_NOI', socket.peerId);
    });
})