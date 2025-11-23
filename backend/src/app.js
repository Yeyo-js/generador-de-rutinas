import express from 'express';
import cors from 'cors';

const server = express();
// puerto 
const port = 3000;

// Middleware
server.use(cors())
server.use(express.json());

const historial = []


server.get('/', (req, res)=>{
    res.send('Servidor activo');
})

server.get('/api/history', (req,  res)=>{
    res.json(historial)
})

server.get("/api/stats", (req, res) => {
    const totalRutinas = historial.length

    const totalMinutos = historial.reduce((total, item) => {
        return total + parseInt(item.tiempo)
    }, 0)

    res.json({
        totalRutinas: totalRutinas,
        totalMinutos: totalMinutos
    })
})

server.post('/api/recommend', (req, res)=>{
    const { materia, tiempo, dificultad } = req.body

    //validacion de datos
    if (!materia || !tiempo || !dificultad) {
        return res.status(400).json({
            error: 'Faltan datos obligatorios' 
        })
    }

    const recomendacionInteligente = generarRutinas(materia, tiempo, dificultad)

    const nuevoRegistro = {
        id: Date.now(),
        materia,
        tiempo,
        dificultad,
        rutina: recomendacionInteligente,
        fecha: new Date().toLocaleString()
    }

    historial.push(nuevoRegistro)

    console.log('Historial actual:', historial)

    res.json({
        message: 'rutina generada correctamente',
        rutinaSugerida: recomendacionInteligente
    })
})

function generarRutinas(materia, tiempo, dificultad) {
    const tiempoNum = parseInt(tiempo)

    if (tiempoNum < 30) {
        if (dificultad === 'dificil') {
            return `Choque Intensivo: Tienes poco tiempo para algo difícil como ${materia}. No intentes aprender todo. Lee solo el resumen ejecutivo o mira un video de 5 min explicando el concepto clave.`
        } else {
            return `Repaso Rápido: Aprovecha estos ${tiempo} min para repasar tus apuntes viejos de ${materia} o hacer un quiz rápido.`
        }
    }

    else if (tiempoNum <= 60) {
        if (dificultad === 'facil') {
            return `Práctica Activa: Como ${materia} es fácil para ti, no leas teoría. Dedica el 100% del tiempo a hacer ejercicios prácticos.`
        } else if (dificultad === 'medio') {
            return `Mapa Mental: Crea un diagrama conectando las ideas principales de ${materia}. Te ayudará a organizar la información.`
        } else {
            return `Técnica Feynman: Lee sobre ${materia} durante 20 min, y luego trata de explicárselo a un niño imaginario (o real) en voz alta. Si te trabas, vuelve a leer.`
        }
    }

    else {
        if (dificultad === 'dificil') {
            return `Divide y Vencerás: Tienes tiempo. Divide el tema de ${materia} en 3 o mas sub-temas pequeños. Estudia 25 min, descansa 5, y sigue con el siguiente sub-tema.`
        } else {
            return `Modo Proyecto: Tienes tiempo y el tema es manejable. Intenta aplicar lo que sabes de ${materia} en un mini-proyecto o caso real. Esto solidificará tu aprendizaje.`
        }
    }
}

server.listen(port, ()=>{
    console.log(`Servidor corriendo en: http://localhost:${port}`);
})
