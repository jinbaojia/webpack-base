import './css/index.less';
import './css/a.css';
console.log(1)

function a (){
    console.log(2)
}

setTimeout(() => {
    console.log(3)
}, 2000);

const aaaa = ()=>{
    console.log('箭头函数')
}

console.log('sdfsd')

aaaa();

Array.from({length:3})

new Promise(()=>{})
import url from './assets/img/a.jpg'
let img = document.createElement('img');
img.setAttribute('src',url)
document.body.appendChild(img)


const but = document.querySelector('.but');
but.addEventListener('click',()=>{
    import("./a")
})