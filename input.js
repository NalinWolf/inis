document.addEventListener("DOMContentLoaded", () => {
    let draggedElement = null; // Элемент, который перетаскивается
    let isSticky = false; // Флаг "следования за курсором или пальцем"
    let originalPosition = null; // Исходная позиция элемента
    let followPointer = null; // Функция для "следования"
    let activeResizeHandle = null; // Текущая ручка изменения размера
    const MIN_SIZE = 50; // Минимальный размер элемента

    const targets = document.querySelectorAll(".target");

    targets.forEach(target => {
        target.style.position = "absolute";
        const rect = target.getBoundingClientRect();
        target.style.left = `${rect.left}px`;
        target.style.top = `${rect.top}px`;

        // Создаем ручки для изменения размера
        const createResizeHandles = () => {
            const handles = ["bottom-right"];
            handles.forEach(handle => {
                const div = document.createElement("div");
                div.className = `resize-handle ${handle}`;
                div.style.position = "absolute";
                div.style.width = "10px";
                div.style.height = "10px";
                div.style.backgroundColor = "black";
                div.style.cursor = "se-resize";

                if (handle === "bottom-right") {
                    div.style.right = "0";
                    div.style.bottom = "0";
                }
                target.appendChild(div);
            });
        };
        createResizeHandles();

        // Перетаскивание мышью
        target.addEventListener("mousedown", (e) => {
            if (e.target.classList.contains("resize-handle")) return;

            if (!isSticky) {
                draggedElement = target;
                originalPosition = { left: target.style.left, top: target.style.top };
                const offsetX = e.clientX - target.getBoundingClientRect().left;
                const offsetY = e.clientY - target.getBoundingClientRect().top;

                const onMouseMove = (moveEvent) => {
                    target.style.left = `${moveEvent.clientX - offsetX}px`;
                    target.style.top = `${moveEvent.clientY - offsetY}px`;
                };

                const onMouseUp = () => {
                    draggedElement = null;
                    document.removeEventListener("mousemove", onMouseMove);
                    document.removeEventListener("mouseup", onMouseUp);
                };

                document.addEventListener("mousemove", onMouseMove);
                document.addEventListener("mouseup", onMouseUp);
            }
        });

        // Двойной клик для "следования за курсором"
        target.addEventListener("dblclick", () => {
            if (!isSticky) {
                isSticky = true;
                draggedElement = target;
                target.style.backgroundColor = "lightblue";

                followPointer = (moveEvent) => {
                    const pointerX = moveEvent.clientX || (moveEvent.touches && moveEvent.touches[0].clientX);
                    const pointerY = moveEvent.clientY || (moveEvent.touches && moveEvent.touches[0].clientY);
                    target.style.left = `${pointerX}px`;
                    target.style.top = `${pointerY}px`;
                };

                document.addEventListener("mousemove", followPointer);
            }
        });

        // Клик завершает режим "следования"
        target.addEventListener("click", () => {
            if (isSticky) {
                isSticky = false;
                target.style.backgroundColor = "";
                document.removeEventListener("mousemove", followPointer);
            }
        });

        // Сенсорное перетаскивание
        target.addEventListener("touchstart", (e) => {
            if (e.target.classList.contains("resize-handle")) return;

            if (e.touches.length > 1) {
                resetState(); // Сброс состояния при втором пальце
                return;
            }

            const touch = e.touches[0];
            const rect = target.getBoundingClientRect();
            const offsetX = touch.clientX - rect.left;
            const offsetY = touch.clientY - rect.top;

            if (!isSticky) {
                draggedElement = target;
                originalPosition = { left: target.style.left, top: target.style.top };

                const onTouchMove = (moveEvent) => {
                    const touchMove = moveEvent.touches[0];
                    target.style.left = `${touchMove.clientX - offsetX}px`;
                    target.style.top = `${touchMove.clientY - offsetY}px`;
                };

                const onTouchEnd = () => {
                    draggedElement = null;
                    document.removeEventListener("touchmove", onTouchMove);
                    document.removeEventListener("touchend", onTouchEnd);
                };

                document.addEventListener("touchmove", onTouchMove);
                document.addEventListener("touchend", onTouchEnd);
            }
        });

        // Изменение размера мышью
        target.addEventListener("mousedown", (e) => {
            if (!e.target.classList.contains("resize-handle")) return;

            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = target.offsetWidth;
            const startHeight = target.offsetHeight;

            const onMouseMove = (moveEvent) => {
                const newWidth = Math.max(MIN_SIZE, startWidth + moveEvent.clientX - startX);
                const newHeight = Math.max(MIN_SIZE, startHeight + moveEvent.clientY - startY);

                target.style.width = `${newWidth}px`;
                target.style.height = `${newHeight}px`;
            };

            const onMouseUp = () => {
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
            };

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        });

        // Изменение размера сенсором
        target.addEventListener("touchstart", (e) => {
            if (!e.target.classList.contains("resize-handle")) return;

            const touch = e.touches[0];
            const startX = touch.clientX;
            const startY = touch.clientY;
            const startWidth = target.offsetWidth;
            const startHeight = target.offsetHeight;

            const onTouchMove = (moveEvent) => {
                const touchMove = moveEvent.touches[0];
                const newWidth = Math.max(MIN_SIZE, startWidth + touchMove.clientX - startX);
                const newHeight = Math.max(MIN_SIZE, startHeight + touchMove.clientY - startY);

                target.style.width = `${newWidth}px`;
                target.style.height = `${newHeight}px`;
            };

            const onTouchEnd = () => {
                document.removeEventListener("touchmove", onTouchMove);
                document.removeEventListener("touchend", onTouchEnd);
            };

            document.addEventListener("touchmove", onTouchMove);
            document.addEventListener("touchend", onTouchEnd);
        });
    });

    // Сброс состояния
    const resetState = () => {
        if (draggedElement) {
            draggedElement.style.left = originalPosition.left;
            draggedElement.style.top = originalPosition.top;
            draggedElement.style.backgroundColor = "";
            draggedElement = null;
        }
        if (isSticky) {
            isSticky = false;
            document.removeEventListener("mousemove", followPointer);
        }
    };

    // Сброс по клавише Esc
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            resetState();
        }
    });
});
