import win32api, win32con


# Hàm click tại vị trí (x, y)
def clicker_pos(x, y):
    """Di chuyển chuột đến vị trí (x, y) và thực hiện click chuột trái"""
    win32api.SetCursorPos((x, y))
    win32api.mouse_event(win32con.MOUSEEVENTF_LEFTDOWN, 0, 0)
    win32api.mouse_event(win32con.MOUSEEVENTF_LEFTUP, 0, 0)


# Kiểm tra màu sắc có khớp với màu đích hay không với ngưỡng cho phép
def color_match(r, g, b, target_r, target_g, target_b, tolerance=10):
    """
    So sánh màu (r, g, b) với màu mục tiêu (target_r, target_g, target_b)
    với sai lệch tối đa là tolerance.
    """
    return abs(r - target_r) < tolerance and abs(g - target_g) < tolerance and abs(b - target_b) < tolerance


def win32_click():
    x, y = win32api.GetCursorPos()  # Get current cursor position
    win32api.mouse_event(win32con.MOUSEEVENTF_LEFTDOWN, x, y, 0, 0)  # Left mouse button down
    win32api.mouse_event(win32con.MOUSEEVENTF_LEFTUP, x, y, 0, 0)  # Left mouse button up
