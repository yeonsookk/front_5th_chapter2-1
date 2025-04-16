import { updateSelOpts } from './function/updateSelOpts.js';

var productList, $select, $addBtn, $cartDisp, $sum, $stockInfo;
var prevSelected,
  // 보너스 포인트
  point = 0,
  // 총 금액
  totalAmount = 0,
  // 총 수량
  itemCount = 0;

// 초기 설정
function main() {
  // 상품 목록 초기화
  productList = [
    { id: 'p1', name: '상품1', price: 10000, quantity: 50 },
    { id: 'p2', name: '상품2', price: 20000, quantity: 30 },
    { id: 'p3', name: '상품3', price: 30000, quantity: 20 },
    { id: 'p4', name: '상품4', price: 15000, quantity: 0 },
    { id: 'p5', name: '상품5', price: 25000, quantity: 10 },
  ];

  // DOM 요소 생성
  var $root = document.getElementById('app');
  let $cont = document.createElement('div');
  var $wrap = document.createElement('div');
  let $hTxt = document.createElement('h1');
  $cartDisp = document.createElement('div');
  $sum = document.createElement('div');
  $select = document.createElement('select');
  $addBtn = document.createElement('button');
  $stockInfo = document.createElement('div');

  // DOM 요소 설정
  $cartDisp.id = 'cart-items';
  $sum.id = 'cart-total';
  $select.id = 'product-select';
  $addBtn.id = 'add-to-cart';
  $stockInfo.id = 'stock-status';
  $cont.className = 'bg-gray-100 p-8';
  ('max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8');
  $hTxt.className = 'text-2xl font-bold mb-4';
  $sum.className = 'text-xl font-bold my-4';
  $select.className = 'border rounded p-2 mr-2';
  $addBtn.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  $stockInfo.className = 'text-sm text-gray-500 mt-2';
  $hTxt.textContent = '장바구니';
  $addBtn.textContent = '추가';

  updateSelOpts();

  $wrap.appendChild($hTxt);
  $wrap.appendChild($cartDisp);
  $wrap.appendChild($sum);
  $wrap.appendChild($select);
  $wrap.appendChild($addBtn);
  $wrap.appendChild($stockInfo);
  $cont.appendChild($wrap);
  $root.appendChild($cont);

  calculateCartCost();

  // 번개세일 이벤트
  // setTimeout은 번개세일 이벤트가 시작되기 전에 랜덤한 시간(최대 10초) 동안 지연되도록 설정되어 있습니다. 이는 이벤트가 즉시 시작되지 않고, 사용자에게 예측할 수 없는 시점에 시작되도록 하기 위함입니다.
  setTimeout(function () {
    // 이후 setInterval을 사용하여 30초마다 무작위로 선택된 상품에 대해 20% 할인을 적용하는 이벤트가 반복적으로 발생합니다.
    setInterval(function () {
      var luckyItem =
        productList[Math.floor(Math.random() * productList.length)];
      if (Math.random() < 0.3 && luckyItem.quantity > 0) {
        luckyItem.price = Math.round(luckyItem.price * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateProduct();
      }
    }, 30000);
  }, Math.random() * 10000);

  // 추천상품 이벤트
  setTimeout(function () {
    setInterval(function () {
      if (prevSelected) {
        var suggest = productList.find(function (item) {
          return item.id !== prevSelected && item.quantity > 0;
        });
        if (suggest) {
          alert(
            suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!'
          );
          suggest.price = Math.round(suggest.price * 0.95);
          updateProduct();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

// 상품 선택 옵션 업데이트
export function updateProduct() {
  $select.innerHTML = '';
  productList.forEach(function (item) {
    var $option = document.createElement('option');
    $option.value = item.id;
    $option.textContent = item.name + ' - ' + item.price + '원';
    if (item.quantity === 0) $option.disabled = true;
    $select.appendChild($option);
  });
}

// 장바구니의 총 금액과 할인율 계산
function calculateCartCost() {
  totalAmount = 0;
  itemCount = 0;
  var $cartItemList = $cartDisp.children;
  var subTot = 0;

  for (var i = 0; i < $cartItemList.length; i++) {
    // 즉시실행함수 -> var를 블록스코프 변수로 변환
    (function () {
      var currentItem;

      // 현재 물품 찾기
      for (var j = 0; j < productList.length; j++) {
        if (productList[j].id === $cartItemList[i].id) {
          currentItem = productList[j];
          break;
        }
      }

      // 현재 물품의 수량과 총 금액 계산
      var quantity = parseInt(
        $cartItemList[i].querySelector('span').textContent.split('x ')[1]
      );
      var itemTotal = currentItem.price * quantity;
      var discount = 0;
      itemCount += quantity;
      subTot += itemTotal;
      if (quantity >= 10) {
        if (currentItem.id === 'p1') discount = 0.1;
        else if (currentItem.id === 'p2') discount = 0.15;
        else if (currentItem.id === 'p3') discount = 0.2;
        else if (currentItem.id === 'p4') discount = 0.05;
        else if (currentItem.id === 'p5') discount = 0.25;
      }
      totalAmount += itemTotal * (1 - discount);
    })();
  }

  // 대량구매 할인 조건 처리
  let discountRate = 0;
  if (itemCount >= 30) {
    var bulkDiscount = totalAmount * 0.25;
    var itemDiscount = subTot - totalAmount;
    if (bulkDiscount > itemDiscount) {
      totalAmount = subTot * (1 - 0.25);
      discountRate = 0.25;
    } else {
      discountRate = (subTot - totalAmount) / subTot;
    }
  } else {
    discountRate = (subTot - totalAmount) / subTot;
  }

  // 화요일 할인 조건 처리
  if (new Date().getDay() === 2) {
    totalAmount *= 1 - 0.1;
    discountRate = Math.max(discountRate, 0.1);
  }

  // 총 금액 표시
  $sum.textContent = '총액: ' + Math.round(totalAmount) + '원';
  if (discountRate > 0) {
    var span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (discountRate * 100).toFixed(1) + '% 할인 적용)';
    $sum.appendChild(span);
  }

  // 재고 상태 업데이트
  updateStockInfo();

  // 보너스 포인트 계산하고 표시
  renderBonusPts();
}

// 보너스 포인트 계산하고 표시
const renderBonusPts = () => {
  point = Math.floor(totalAmount / 1000);
  var $point = document.getElementById('loyalty-points');
  if (!$point) {
    $point = document.createElement('span');
    $point.id = 'loyalty-points';
    $point.className = 'text-blue-500 ml-2';
    $sum.appendChild($point);
  }
  $point.textContent = '(포인트: ' + point + ')';
};

// 재고 상태 업데이트
function updateStockInfo() {
  var stockInfo = '';
  productList.forEach(function (item) {
    if (item.quantity < 5) {
      stockInfo +=
        item.name +
        ': ' +
        (item.quantity > 0
          ? '재고 부족 (' + item.quantity + '개 남음)'
          : '품절') +
        '\n';
    }
  });
  $stockInfo.textContent = stockInfo;
}
// 초기설정 실행
main();

// addBtn 클릭 이벤트 처리
$addBtn.addEventListener('click', function () {
  var select = $select.value;
  var newItem = productList.find(function (item) {
    return item.id === select;
  });
  if (newItem && newItem.quantity > 0) {
    var item = document.getElementById(newItem.id);
    if (item) {
      var newQuantity =
        parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;
      if (newQuantity <= newItem.quantity) {
        item.querySelector('span').textContent =
          newItem.name + ' - ' + newItem.price + '원 x ' + newQuantity;
        newItem.quantity--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      var $newItem = document.createElement('div');
      $newItem.id = newItem.id;
      $newItem.className = 'flex justify-between items-center mb-2';
      $newItem.innerHTML =
        '<span>' +
        newItem.name +
        ' - ' +
        newItem.price +
        '원 x 1</span><div>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        newItem.id +
        '" data-change="-1">-</button>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        newItem.id +
        '" data-change="1">+</button>' +
        '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
        newItem.id +
        '">삭제</button></div>';
      $cartDisp.appendChild($newItem);
      $newItem.quantity--;
    }
    calculateCartCost();
    prevSelected = select;
  }
});

// cartDisp 클릭 이벤트 처리
$cartDisp.addEventListener('click', function (event) {
  var target = event.target;
  // 클릭 요소가 클래스를 가지고 있는지 확인
  if (
    target.classList.contains('quantity-change') ||
    target.classList.contains('remove-item')
  ) {
    var prodId = target.dataset.productId;
    var $itemElement = document.getElementById(prodId);
    var prod = productList.find(function (p) {
      return p.id === prodId;
    });
    if (target.classList.contains('quantity-change')) {
      var qtyChange = parseInt(target.dataset.change);
      var newQty =
        parseInt(
          $itemElement.querySelector('span').textContent.split('x ')[1]
        ) + qtyChange;
      if (
        newQty > 0 &&
        newQty <=
          prod.q +
            parseInt(
              $itemElement.querySelector('span').textContent.split('x ')[1]
            )
      ) {
        $itemElement.querySelector('span').textContent =
          $itemElement.querySelector('span').textContent.split('x ')[0] +
          'x ' +
          newQty;
        prod.q -= qtyChange;
      } else if (newQty <= 0) {
        $itemElement.remove();
        prod.q -= qtyChange;
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (target.classList.contains('remove-item')) {
      var remQty = parseInt(
        $itemElement.querySelector('span').textContent.split('x ')[1]
      );
      prod.q += remQty;
      $itemElement.remove();
    }
    calculateCartCost();
  }
});
