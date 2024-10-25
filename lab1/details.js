document.addEventListener('DOMContentLoaded', () => {
    // Извлекаем данные о выбранной футболке из localStorage
    const selectedShirt = JSON.parse(localStorage.getItem('selectedShirt'));

    if (!selectedShirt) {
        alert('Футболка не выбрана!');
        return;
    }

    // Заполняем контент на странице
    document.getElementById('shirt-name').textContent = selectedShirt.name;
    document.getElementById('shirt-description').textContent = selectedShirt.description;
    document.getElementById('shirt-price').textContent = selectedShirt.price;

    const firstColor = Object.keys(selectedShirt.colors)[0];
    const frontImage = selectedShirt.colors[firstColor]?.front || selectedShirt.default.front;
    const backImage = selectedShirt.colors[firstColor]?.back || selectedShirt.default.back;

    document.getElementById('shirt-front').src = frontImage;
    document.getElementById('shirt-back').src = backImage;

    // Генерация кнопок для доступных цветов
    const colorButtonsDiv = document.getElementById('color-buttons');
    Object.keys(selectedShirt.colors).forEach(color => {
        const colorButton = document.createElement('button');
        colorButton.textContent = color;
        colorButton.style.backgroundColor = color;
        colorButton.style.color = 'black';
        colorButton.addEventListener('click', () => {
            // Меняем изображение футболки в зависимости от выбранного цвета
            document.getElementById('shirt-front').src = selectedShirt.colors[color].front;
            document.getElementById('shirt-back').src = selectedShirt.colors[color].back;
        });
        colorButtonsDiv.appendChild(colorButton);
    });
});
