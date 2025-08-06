// activeIndex: 선택화면에서 선택된 메모의 인덱스
// new 메모인 경우 activeIndex를 -1 로 설정
let activeIndex = null;

// 메모는 { content: string, color: string } 형태로 localStorage에 저장
function getMemos() {
  return JSON.parse(localStorage.getItem("memos")) || [];
}

function setMemos(memos) {
  localStorage.setItem("memos", JSON.stringify(memos));
}

// 선택화면(UI) 표시
function displaySelectionScreen() {
  document.getElementById("selectionScreen").style.display = "block";
  document.getElementById("editScreen").style.display = "none";
  displayMemos();
}

// 편집화면(UI) 표시
function openEditScreen() {
  document.getElementById("selectionScreen").style.display = "none";
  document.getElementById("editScreen").style.display = "block";

  const memoInput = document.getElementById("memoInput");
  const colorPicker = document.getElementById("colorPicker");

  if (activeIndex === -1) {
    // 새 메모인 경우
    memoInput.value = "";
    colorPicker.value = "#ffffff"; // 기본 색상
  } else if (activeIndex !== null) {
    // 기존 메모 편집하는 경우
    let memos = getMemos();
    memoInput.value = memos[activeIndex].content;
    colorPicker.value = memos[activeIndex].color || "#ffffff";
  }
}

// 선택화면에서 메모 리스트 표시
function displayMemos() {
  const memoList = document.getElementById("memoList");
  memoList.innerHTML = "";
  const memos = getMemos();

  memos.forEach((memo, index) => {
    let li = document.createElement("li");
    li.textContent = memo.content;
    li.style.backgroundColor = memo.color;

    // 선택된 메모에는 active 클래스 추가
    if (activeIndex === index) {
      li.classList.add("active");
    }

    // 클릭 이벤트:
    // - 처음 클릭하면 선택 상태 (하이라이트) 적용
    // - 이미 선택된 메모를 클릭하면 편집화면으로 전환
    li.addEventListener("click", () => {
      if (activeIndex === index) {
        openEditScreen();
      } else {
        activeIndex = index;
        displayMemos();
      }
    });

    memoList.appendChild(li);
  });
}

// 새 메모 생성 (+ 버튼)
document.getElementById("newMemoButton").addEventListener("click", () => {
  activeIndex = -1; // 새 메모를 의미
  openEditScreen();
});

// 선택화면에서 삭제 버튼 이벤트
document.getElementById("deleteMemoButton").addEventListener("click", () => {
  if (activeIndex !== null && activeIndex !== -1) {
    let memos = getMemos();
    memos.splice(activeIndex, 1);
    setMemos(memos);
    activeIndex = null;
    displayMemos();
  }
});

// 편집화면의 뒤로가기 버튼 (< 버튼)
document.getElementById("backButton").addEventListener("click", () => {
  activeIndex = null;
  displaySelectionScreen();
});

// 편집화면에서 저장 버튼 이벤트
document.getElementById("saveMemoButton").addEventListener("click", () => {
  const memoInputValue = document.getElementById("memoInput").value.trim();
  const selectedColor = document.getElementById("colorPicker").value;
  let memos = getMemos();

  if (activeIndex === -1) {
    // 새 메모 저장: 내용이 있을 때만 저장
    if (memoInputValue) {
      memos.push({ content: memoInputValue, color: selectedColor });
    }
  } else if (activeIndex !== null) {
    // 기존 메모 업데이트; 내용이 없으면 삭제
    if (memoInputValue) {
      memos[activeIndex] = { content: memoInputValue, color: selectedColor };
    } else {
      memos.splice(activeIndex, 1);
    }
  }
  setMemos(memos);
  activeIndex = null;
  displaySelectionScreen();
});

// 초기 화면은 선택화면으로
displaySelectionScreen();