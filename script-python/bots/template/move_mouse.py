import win32api
import win32con
import keyboard
import threading
import time

# Khoảng cách di chuyển từ A sang B
distance = 350
step = 10  # Bước nhỏ để tạo cảm giác bóng

# Cờ để kiểm soát quá trình di chuyển
move_flag = False


def move_mouse():
    global move_flag
    while move_flag:
        # Lấy vị trí chuột hiện tại
        x, y = win32api.GetCursorPos()

        # Di chuyển từ A sang B với bước nhỏ
        for _ in range(distance // step):
            win32api.SetCursorPos((x + step, y))
            x, y = win32api.GetCursorPos()  # Cập nhật vị trí hiện tại

        # Di chuyển từ B về lại A với bước nhỏ
        for _ in range(distance // step):
            win32api.SetCursorPos((x - step, y))
            x, y = win32api.GetCursorPos()


def start_movement():
    global move_flag
    if not move_flag:
        move_flag = True
        threading.Thread(target=move_mouse).start()  # Chạy quá trình di chuyển trong một thread riêng


def stop_movement():
    global move_flag
    move_flag = False


# Lắng nghe sự kiện nhấn phím
keyboard.add_hotkey("[", start_movement)  # Nhấn 'o' để bắt đầu di chuyển
keyboard.add_hotkey("]", stop_movement)  # Nhấn 'p' để dừng di chuyển

# Chờ cho đến khi nhấn 'esc' để thoát chương trình
keyboard.wait("esc")
