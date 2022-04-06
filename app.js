const express = require('express')
const { path } = require('express/lib/application')
const { Router } = express
const app = express()
const router = Router()

const PORT = 8080
const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
 })
server.on("error", error => console.log(`Error en servidor ${error}`))

app.use('/static', express.static(__dirname + '/public'));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', router)



let productos = [
    { id: 1,
    timestamp: "22",
    nombre: "carpeta",
    descripcion: "asd",
    codigo: 123,
    foto: "asda.po",
    precio: 333,
    stock: 2,
    }
]

let carritos = [
    { id: 1,
    timestamp: "22",
        productos: [{
            id: '1',
            timestamp: "22",
            nombre: "carpeta",
            descripcion: "asd",
            codigo: 123,
            foto: "asda.po",
            precio: 333,
            stock: 2,
            },
            {
            id: '3',
            timestamp: "2333",
            nombre: "hoja",
            descripcion: "blanca",
            codigo: 123,
            foto: "asda.po",
            precio: 333,
            stock: 332,
            }],    
    }
]

let admin = false


// MIDDLEWARES
function adminMiddleware (req, res, next) {
    if (admin == true){
    next()
    } else {
        res.send({error: -1, descripcion: 'No autorizado'})
    }
}

//VER TODOS LOS PRODUCTOS
router.get('/productos', (req, res) => {res.send(productos)})

//NUEVO PRODUCTO
router.post('/productos',adminMiddleware,(req, res) => {
    let productosById = productos.sort((a, b) => a.id - b.id)
    const ultimoProducto = productosById[productosById.length - 1]
    const nuevoProducto = {timestamp: Date.now(), nombre: req.body.nombre, descripcion: req.body.descripcion, codigo: req.body.codigo, precio: req.body.precio, stock: req.body.stock, foto: req.body.foto, id: ultimoProducto.id + 1}
    productos.push(nuevoProducto)
    res.send(productos)
})

//VER PRODUCTO POR ID
router.get('/productos/:id', (req, res) => {
    if (isNaN(req.params.id)) {
        res.send({error: 'El parámetro no es un número'})
        return
    }
    const id = parseInt(req.params.id);
    let productoById = productos.find(product => product.id == id );
    if(!productoById) {
        res.send({error: 'El producto no existe'})
        return
    }
    res.send(productoById)
})

//EDITAR PRODUCTO POR ID
router.put('/productos/:id',adminMiddleware, (req, res) => {
    if (isNaN(req.params.id)) {
        res.send({error: 'El parámetro no es un número'})
        return
    }
    const id = parseInt(req.params.id);
    let productoById = productos.find(product => product.id == id );
    if(!productoById) {
        res.send({error: 'El producto no existe'})
        return
    }
    let pos = productos.indexOf(productoById)
    productoEdit = {timestamp: Date.now(), nombre: req.body.nombre, descripcion: req.body.descripcion, codigo: req.body.codigo, precio: req.body.precio, stock: req.body.stock, foto: req.body.foto, id: id}
    productos[pos] = productoEdit
    res.send(productos)
})

//ELIMINAR PRODUCTO POR ID
router.delete('/productos/:id',adminMiddleware, (req, res) => {
    if (isNaN(req.params.id)) {
        res.send({error: 'El parámetro no es un número'})
        return
    }
    const id = parseInt(req.params.id);
    let productoById = productos.find(product => product.id == id );
    if(!productoById) {
        res.send({error: 'El producto no existe'})
        return
    }
    let pos = productos.indexOf(productoById)
    productos = productos.splice(pos - 1, 1)
    console.log(pos)
    console.log(productos)
    res.send(productos)
})

////// CARRITO ////////


//NUEVO CARRITO
router.post('/carrito',(req, res) => {
    let carritosById = carritos.sort((a, b) => a.id - b.id)
    const ultimoCarrito = carritosById[carritosById.length - 1]
    const nuevoCarrito = {timestamp: Date.now(),id: ultimoCarrito.id + 1, productos: []}
    let idCarrito = nuevoCarrito.id
    console.log(idCarrito)
    carritos.push(nuevoCarrito)
    res.send('ID Carrito:' + idCarrito)
})
//ELIMINAR CARRITO POR ID
router.delete('/carrito/:id', (req, res) => {
    if (isNaN(req.params.id)) {
        res.send({error: 'El parámetro no es un número'})
        return
    }
    const id = parseInt(req.params.id);
    let carritoById = carritos.find(carro => carro.id == id );
    if(!carritoById) {
        res.send({error: 'El carrito no existe'})
        return
    }
    let pos = carritos.indexOf(carritoById)
    carritos = carritos.splice(pos - 1, 1)
    console.log(pos)
    console.log(carritos)
    res.send('Carrito eliminado')
})

//VER PRODUCTO POR ID
router.get('/carrito/:id/productos', (req, res) => {
    if (isNaN(req.params.id)) {
        res.send({error: 'El parámetro no es un número'})
        return
    }
    const id = parseInt(req.params.id);
    let carritoById = carritos.find(carro => carro.id == id );
    if(!carritoById) {
        res.send({error: 'El carrito no existe'})
        return
    }
    let productosCarrito = carritoById.productos
    res.send(productosCarrito)
})

//NUEVO PRODUCTO EN CARRITO
router.post('/carrito/:id/productos',(req, res) => {

})

//ELIMINAR CARRITO POR ID
router.delete('/carrito/:id/productos/:id_prod', (req, res) => {
    if (isNaN(req.params.id)) {
        res.send({error: 'El parámetro no es un número'})
        return
    }
    const id = parseInt(req.params.id);
    let carritoById = carritos.find(carro => carro.id == id );
    if(!carritoById) {
        res.send({error: 'El carrito no existe'})
        return
    }

    let productCarrito = carritoById.productos
    let pos = productCarrito.indexOf(req.params.id_prod)
    productCarrito = productCarrito.splice(pos - 1, 1)
    res.send('Producto eliminado')
})

router.get('*', (req, res) => {res.send({error: -2, descripcion: 'La ruta no está implementada'})})