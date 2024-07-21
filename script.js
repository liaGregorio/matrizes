// Função para calcular a transposição de uma matriz
function transposeMatrix(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
}

// Função para calcular a matriz oposta (inversa aditiva)
function negativeMatrix(matrix) {
    return matrix.map(row => row.map(cell => math.multiply(cell, -1)));
}

// Contador de matrizes adicionadas
let matrixCount = 0;

// Função para adicionar um campo de entrada para uma nova matriz
function addMatrix() {
    matrixCount++;
    const matrixInputDiv = document.getElementById('matrixInput');
    const newMatrixInput = `
        <textarea class="form-control mb-2" id="matrix${matrixCount}Input" rows="4" placeholder="Digite a matriz ${matrixCount}"></textarea>
    `;
    matrixInputDiv.insertAdjacentHTML('beforeend', newMatrixInput);
}

// Função para remover o último campo de entrada de matriz adicionado
function removeMatrix() {
    if (matrixCount > 0) {
        const matrixInputDiv = document.getElementById('matrixInput');
        matrixInputDiv.removeChild(matrixInputDiv.lastElementChild);
        matrixCount--;
    }
}

// Função principal para calcular operações entre matrizes (soma, subtração, multiplicação)
function calculateMatrices() {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    // Verifica se há pelo menos duas matrizes para calcular operações
    if (matrixCount < 2) {
        resultDiv.innerHTML = '<p class="text-danger">Por favor, adicione pelo menos duas matrizes para calcular operações.</p>';
        return;
    }

    // Array para armazenar as matrizes inseridas pelo usuário
    let matrices = [];
    for (let i = 1; i <= matrixCount; i++) {
        const matrixInput = document.getElementById(`matrix${i}Input`).value;
        const matrix = parseMatrix(matrixInput);
        matrices.push(matrix);
    }

    // Operação selecionada pelo usuário (soma, subtração, multiplicação)
    const operation = document.getElementById('operation').value;
    let result;

    // Realiza a operação conforme selecionado
    if (operation === 'soma') {
        result = addMatrices(matrices);
    } else if (operation === 'subtracao') {
        result = subtractMatrices(matrices);
    } else if (operation === 'multiplicacao') {
        result = multiplyMatrices(matrices);
    } else if (operation === 'divisao') {
        result = 'Erro: A divisão direta de matrizes não existe. Considere usar a multiplicação pela inversa.';
    } 

    // Exibe o resultado formatado na página
    resultDiv.innerHTML = `<h5>Resultado da ${operation.charAt(0).toUpperCase() + operation.slice(1)}</h5>`;
    resultDiv.innerHTML += formatMatrix(result);
    resultDiv.innerHTML += '<hr>';
}

// Função para converter uma string de entrada em uma matriz numérica
function parseMatrix(input) {
    return input.trim().split('\n').map(row => row.trim().split(' ').map(cell => math.fraction(cell)));
}
// Função para formatar uma matriz para exibição na página
function formatMatrix(matrix) {
    if (typeof matrix === 'string') return `<p class="text-danger">${matrix}</p>`;
    return '<pre>' + matrix.map(row => row.map(cell => formatFraction(cell)).join(' ')).join('\n') + '</pre>';
}

function addMatrices(matrices) {
    const [rows, cols] = [matrices[0].length, matrices[0][0].length];

    for (let matrix of matrices) {
        if (matrix.length !== rows || matrix[0].length !== cols) {
            return 'Erro: As matrizes devem ter o mesmo tamanho para serem somadas.';
        }
    }

    let result = Array.from({ length: rows }, () => Array(cols).fill(math.fraction(0)));

    for (let matrix of matrices) {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                result[i][j] = math.add(result[i][j], matrix[i][j]);
            }
        }
    }
    return result;
}

function subtractMatrices(matrices) {
    const [rows, cols] = [matrices[0].length, matrices[0][0].length];

    for (let matrix of matrices) {
        if (matrix.length !== rows || matrix[0].length !== cols) {
            return 'Erro: As matrizes devem ter o mesmo tamanho para serem subtraídas.';
        }
    }

    let result = Array.from({ length: rows }, () => Array(cols).fill(math.fraction(0)));

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            result[i][j] = matrices[0][i][j];
        }
    }

    for (let k = 1; k < matrices.length; k++) {
        let matrix = matrices[k];
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                result[i][j] = math.subtract(result[i][j], matrix[i][j]);
            }
        }
    }
    return result;
}

// Função para multiplicar matrizes
function multiplyMatrices(matrices) {
    let result = matrices[0];
    for (let k = 1; k < matrices.length; k++) {
        let matrix = matrices[k];
        let [rowsA, colsA] = [result.length, result[0].length];
        let [rowsB, colsB] = [matrix.length, matrix[0].length];

        if (colsA !== rowsB) {
            return 'Erro: O número de colunas da matriz A deve ser igual ao número de linhas da matriz B para multiplicação.';
        }

        let newResult = Array.from({ length: rowsA }, () => Array(colsB).fill(math.fraction(0)));

        for (let i = 0; i < rowsA; i++) {
            for (let j = 0; j < colsB; j++) {
                for (let l = 0; l < colsA; l++) {
                    newResult[i][j] = math.add(newResult[i][j], math.multiply(result[i][l], matrix[l][j]));
                }
            }
        }
        result = newResult;
    }
    return result;
}

// Função para verificar o tipo de matriz (linha, coluna, nula, quadrada, etc.)
function checkMatrixType() {
    const matrixInput = document.getElementById('matrixInputType').value;
    const matrix = parseMatrix(matrixInput);
    const typeResult = document.getElementById('typeResult');

    typeResult.innerHTML = `Dimensões: ${matrix.length} x ${matrix[0].length}<br>`;
    typeResult.innerHTML += `Tipo: ${getMatrixType(matrix)}<br>`;
}

// Função para determinar o tipo específico de matriz
function getMatrixType(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;

    if (rows === 1) return 'Linha';
    if (cols === 1) return 'Coluna';
    if (matrix.every(row => row.every(cell => cell.equals(math.fraction(0))))) return 'Nula';
    if (rows === cols) {
        if (isIdentity(matrix)) return 'Identidade';
        const triangularType = isTriangular(matrix);
        if (triangularType) return `Triangular ${triangularType}`;
        return 'Quadrada';
    }
    return 'Retangular';
}

// Função para verificar se uma matriz é a identidade
function isIdentity(matrix) {
    const n = matrix.length;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (i === j && !matrix[i][j].equals(math.fraction(1))) return false;
            if (i !== j && !matrix[i][j].equals(math.fraction(0))) return false;
        }
    }
    return true;
}

// Função para verificar se uma matriz é triangular
function isTriangular(matrix) {
    const n = matrix.length;
    let isUpper = true;
    let isLower = true;

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (i > j && !matrix[i][j].equals(math.fraction(0))) isUpper = false;
            if (i < j && !matrix[i][j].equals(math.fraction(0))) isLower = false;
        }
    }

    if (isUpper && !isLower) return 'Superior';
    if (isLower && !isUpper) return 'Inferior';
    return null;
}

// Função para calcular a inversa de uma matriz
function calculateInverse() {
    const matrixInput = document.getElementById('matrixInputType').value;
    const matrix = parseMatrix(matrixInput);
    const inverseResult = document.getElementById('inverseResult');

    // Verifica se a matriz é quadrada para calcular a inversa
    if (matrix.length !== matrix[0].length) {
        inverseResult.innerHTML = '<p class="text-danger">A matriz deve ser quadrada para calcular a inversa.</p>';
        return;
    }

    // Calcula a matriz inversa
    const inverseMatrix = invertMatrix(matrix);
    if (inverseMatrix) {
        inverseResult.innerHTML = `<h5>Matriz Inversa:</h5>${formatMatrix(inverseMatrix)}`;
    } else {
        inverseResult.innerHTML = '<p class="text-danger">A matriz não é inversível.</p>';
    }
}

// Função para calcular a inversa de uma matriz usando a biblioteca math.js
function invertMatrix(matrix) {
    try {
        const inverse = math.inv(matrix);
        return inverse.map(row => row.map(cell => math.fraction(cell)));
    } catch (e) {
        return null;
    }
}

// Função para formatar frações na exibição da matriz
function formatFraction(fraction) {
    const numerator = fraction.n;
    const denominator = fraction.d;

    if (denominator === 1) {
        return `<span class="fraction">${numerator}</span>`;
    } else {
        return `<span class="fraction"><span class="numerator">${numerator}</span><span class="denominator">${denominator}</span></span>`;
    }
}

// Função para calcular a transposição da matriz atualmente exibida
function transposeCurrentMatrix() {
    const matrixInput = document.getElementById('matrixInputType').value;
    const matrix = parseMatrix(matrixInput);
    const transposeResult = document.getElementById('transposeResult');

    // Calcula a matriz transposta
    const transposedMatrix = transposeMatrix(matrix);
    transposeResult.innerHTML = `<h5>Matriz Transposta:</h5>${formatMatrix(transposedMatrix)}`;
}

// Função para calcular a matriz oposta (inversa aditiva) da matriz atualmente exibida
function negativeCurrentMatrix() {
    const matrixInput = document.getElementById('matrixInputType').value;
    const matrix = parseMatrix(matrixInput);
    const negativeResult = document.getElementById('negativeResult');

    // Calcula a matriz oposta
    const negativeMatrixResult = negativeMatrix(matrix);
    negativeResult.innerHTML = `<h5>Matriz Oposta (Inversa Aditiva):</h5>${formatMatrix(negativeMatrixResult)}`;
}

// Função para mostrar a diagonal principal e secundária da matriz
function showDiagonals() {
    const matrixInput = document.getElementById('matrixInputType').value;
    const matrix = parseMatrix(matrixInput);
    const diagonalResult = document.getElementById('diagonalResult');

    if (matrix.length !== matrix[0].length) {
        diagonalResult.innerHTML = '<p class="text-danger">A matriz deve ser quadrada para mostrar as diagonais.</p>';
        return;
    }

    const principalDiagonal = matrix.map((row, i) => row[i]);
    const secondaryDiagonal = matrix.map((row, i) => row[row.length - 1 - i]);

    diagonalResult.innerHTML = `<h5>Diagonais:</h5>`;
    diagonalResult.innerHTML += `<p>Diagonal Principal: ${principalDiagonal.map(cell => formatFraction(cell)).join(' ')}</p>`;
    diagonalResult.innerHTML += `<p>Diagonal Secundária: ${secondaryDiagonal.map(cell => formatFraction(cell)).join(' ')}</p>`;
}

// Função para formatar um array para exibição na página
function formatArray(array) {
    return `<pre>${array.join(' ')}</pre>`;
}

// Função para gerar uma matriz identidade do tamanho especificado
function generateIdentityMatrix() {
    const sizeInput = document.getElementById('identitySize').value;
    const size = parseInt(sizeInput);

    if (isNaN(size) || size <= 0) {
        document.getElementById('identityResult').innerHTML = '<p class="text-danger">Por favor, insira um número válido maior que 0.</p>';
        return;
    }

    // Cria a matriz identidade
    const matrix = Array.from({ length: size }, (_, i) =>
        Array.from({ length: size }, (_, j) => i === j ? math.fraction(1) : math.fraction(0))
    );

    // Exibe a matriz identidade
    document.getElementById('identityResult').innerHTML = `<h5>Matriz Identidade ${size} x ${size}:</h5>${formatMatrix(matrix)}`;
}

function generateTriangularMatrix() {
    const sizeInput = document.getElementById('triangularSize').value;
    const size = parseInt(sizeInput);
    const type = document.getElementById('triangularType').value;

    if (isNaN(size) || size <= 0) {
        document.getElementById('triangularMatrix').innerHTML = 'Por favor, insira um número válido maior que 0.';
        return;
    }

    // Cria a matriz triangular com inputs
    const matrixDiv = document.getElementById('triangularMatrix');
    matrixDiv.innerHTML = '';

    for (let i = 0; i < size; i++) {
        const rowDiv = document.createElement('div');
        for (let j = 0; j < size; j++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'matrix-input';

            if (type === 'inferior' && j < i) {
                input.disabled = false;
                input.value = '';
            } else if (type === 'superior' && j > i) {
                input.disabled = false;
                input.value = '';
            } else {
                input.value = '0';
            }
            rowDiv.appendChild(input);
        }
        matrixDiv.appendChild(rowDiv);
    }
}

// Função para multiplicar uma matriz por um valor
function multiplyMatrixByValue() {
    const matrixInput = document.getElementById('matrixInputMultiplication').value;
    const matrix = parseMatrix(matrixInput);
    const value = parseFloat(document.getElementById('multiplicationValue').value);
    const multiplicationResult = document.getElementById('multiplicationResult');

    if (isNaN(value)) {
        multiplicationResult.innerHTML = '<p class="text-danger">Por favor, insira um valor numérico válido para multiplicar a matriz.</p>';
        return;
    }

    // Multiplica a matriz pelo valor
    const result = matrix.map(row => row.map(cell => math.multiply(cell, math.fraction(value))));
    multiplicationResult.innerHTML = `<h5>Resultado da Multiplicação:</h5>${formatMatrix(result)}`;
}