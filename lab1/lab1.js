document.addEventListener("DOMContentLoaded", () => {
    const shirtList = document.getElementById('shirt-list');
    const quickViewModal = document.getElementById('quickViewModal');
    const quickViewImage = document.getElementById('quickViewImage');
    const quickViewName = document.getElementById('quickViewName');
    const quickViewPrice = document.getElementById('quickViewPrice');
    const closeQuickView = document.getElementById('closeQuickView');

    // Функция для генерации карточек футболок
    function generateShirts() {
        shirts.forEach((shirt, index) => {
            const card = document.createElement('div');
            card.classList.add('shirt-card');

            // Получаем первый доступный цвет
            const firstColor = Object.keys(shirt.colors)[0];
            const frontImage = shirt.colors[firstColor]?.front || shirt.default.front;

            // Создаем элементы карточки
            const img = document.createElement('img');
            img.src = frontImage;
            img.alt = shirt.name;

            const name = document.createElement('h3');
            name.textContent = shirt.name;

            const price = document.createElement('p');
            price.textContent = shirt.price;

            const quickViewBtn = document.createElement('button');
            quickViewBtn.textContent = 'Quick View';
            quickViewBtn.classList.add('quick-view');
            quickViewBtn.addEventListener('click', () => openQuickView(index));

            const seePageBtn = document.createElement('button');
            seePageBtn.textContent = 'See Page';

            // Добавляем элементы в карточку
            card.appendChild(img);
            card.appendChild(name);
            card.appendChild(price);
            card.appendChild(quickViewBtn);
            card.appendChild(seePageBtn);

            // Добавляем карточку в список
            shirtList.appendChild(card);
        });
    }

    // Функция для открытия Quick View
    function openQuickView(index) {
        const shirt = shirts[index];
        const firstColor = Object.keys(shirt.colors)[0];
        const frontImage = shirt.colors[firstColor]?.front || shirt.default.front;

        quickViewImage.src = frontImage;
        quickViewName.textContent = shirt.name;
        quickViewPrice.textContent = shirt.price;

        quickViewModal.style.display = 'block';
    }

    // Закрытие модального окна
    closeQuickView.addEventListener('click', () => {
        quickViewModal.style.display = 'none';
    });

    // Генерируем футболки при загрузке страницы
    generateShirts();
});
