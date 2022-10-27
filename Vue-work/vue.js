function render(vnode, container) {
    const el = document.createElement(vnode.tag);

    container.appendChild(el)
}

const visualDom = {
    tag: 'div',
    
}