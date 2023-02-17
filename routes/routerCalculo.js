import { Router }  from 'express';
import { fork } from 'child_process'
import path from 'path'


const forkRouter = Router();

forkRouter.get('/api/randoms', (req, res) => {

    const calculo = fork(path.resolve('./api/calculo.js'))
    
    calculo.on('message', result => {
        
        if (result == 'listo') {
            calculo.send(req.query?.cant || 100000000)
        } else {
            res.json(result)
        }
    })
})

export default forkRouter