(function() {
    // 图片列表（相对于站点根目录）
    const images = [
        '/images/bg/bg1.webp',
        '/images/bg/bg2.jpg',
       
    ];

    // 随机选一张
    const randomIndex = Math.floor(Math.random() * images.length);
    const bgUrl = images[randomIndex];

    // 应用背景图到 body
    document.body.style.backgroundImage = `url('${bgUrl}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
})();