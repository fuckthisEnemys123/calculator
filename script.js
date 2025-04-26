function formatNumber(num) {
    return num % 1 === 0 ? num.toString() : num.toFixed(2);
}

function calculateMaterials() {
    const length = parseFloat(document.getElementById('length').value);
    const width = parseFloat(document.getElementById('width').value);
    const height = parseFloat(document.getElementById('height').value);

    if (!length || !width || !height) {
        alert("Заполните длину, ширину и высоту!");
        return false;
    }

    const area = length * width;
    const volume = area * height;
    const boardsCount = Math.ceil(area / 6);
    const armatureWeight = Math.ceil(area * 0.5);
    const sandVolume = (area * 0.05).toFixed(2); // Подушка 5 см

    document.getElementById('area-result').textContent = `${formatNumber(area)} м²`;
    document.getElementById('volume-result').textContent = `${formatNumber(volume)} м³`;
    document.getElementById('boards-result').textContent = `${boardsCount} шт.`;
    document.getElementById('armature-result').textContent = `${armatureWeight} кг`;
    document.getElementById('sand-result').textContent = `${sandVolume} м³`;

    return { area, volume, boardsCount, armatureWeight, sandVolume };
}

function calculateBudget(materials) {
    const isFoundation = document.querySelector('input[name="object-type"]:checked').value === 'foundation';
    const workPrice = parseFloat(document.getElementById('work-price').value);
    
    // Обновляем подпись для цены работ
    const workUnits = isFoundation ? 'м³' : 'м²';
    document.getElementById('work-price-label').textContent = `Работа (${workUnits})`;

    // Считаем стоимость работ
    const workCost = isFoundation 
        ? materials.volume * workPrice 
        : materials.area * workPrice;

    // Получаем цены материалов
    const prices = {
        board: parseFloat(document.getElementById('board-price').value),
        armature: parseFloat(document.getElementById('armature-price').value),
        concrete: parseFloat(document.getElementById('concrete-price').value),
        sand: parseFloat(document.getElementById('sand-price').value),
        delivery: parseFloat(document.getElementById('delivery-price').value) || 0
    };

    // Считаем суммы
    const costs = {
        boards: materials.boardsCount * prices.board,
        armature: materials.armatureWeight * prices.armature,
        concrete: materials.volume * prices.concrete,
        sand: materials.sandVolume * prices.sand,
        delivery: prices.delivery,
        work: workCost
    };

    const total = Object.values(costs).reduce((sum, cost) => sum + cost, 0);

    // Формируем таблицу
    document.querySelector('#total-result table').innerHTML = `
        <tr><th>Наименование</th><th>Кол-во</th><th>Цена</th><th>Сумма</th></tr>
        <tr><td>Доски</td><td>${materials.boardsCount} шт.</td><td>${formatNumber(prices.board)} руб</td><td><b>${formatNumber(costs.boards)} руб</b></td></tr>
        <tr><td>Арматура</td><td>${materials.armatureWeight} кг</td><td>${formatNumber(prices.armature)} руб</td><td><b>${formatNumber(costs.armature)} руб</b></td></tr>
        <tr><td>Бетон</td><td>${formatNumber(materials.volume)} м³</td><td>${formatNumber(prices.concrete)} руб</td><td><b>${formatNumber(costs.concrete)} руб</b></td></tr>
        <tr><td>Песок</td><td>${materials.sandVolume} м³</td><td>${formatNumber(prices.sand)} руб</td><td><b>${formatNumber(costs.sand)} руб</b></td></tr>
        <tr><td>Доставка</td><td>1</td><td>${formatNumber(prices.delivery)} руб</td><td><b>${formatNumber(costs.delivery)} руб</b></td></tr>
        <tr><td>Работа (${workUnits})</td><td>${isFoundation ? formatNumber(materials.volume) : formatNumber(materials.area)}</td><td>${formatNumber(workPrice)} руб</td><td><b>${formatNumber(workCost)} руб</b></td></tr>
        <tr class="total-row"><td colspan="3"><b>Итого</b></td><td><b>${formatNumber(total)} руб</b></td></tr>
    `;
}

function calculateAll() {
    const materials = calculateMaterials();
    if (materials) calculateBudget(materials);
}

// Обновляем подпись при переключении типа объекта
document.querySelectorAll('input[name="object-type"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const isFoundation = this.value === 'foundation';
        document.getElementById('work-price').value = isFoundation ? '7000' : '1200';
        if (materials) calculateBudget(materials);
    });
});

let materials;
window.onload = function() {
    materials = calculateMaterials();
    if (materials) calculateBudget(materials);
};
