from module.snipping_tool import run_snipping_tool
from module.auto_clicker import clicker_pos, color_match
from module.control import ScriptController

from pyautogui import *
import pyautogui
import time


color, top_left_x, top_left_y, width_specific, height_specific = run_snipping_tool()
top_left_x, top_left_y, width_specific, height_specific = int(top_left_x), int(top_left_y), int(width_specific), int(height_specific)

# Delay to allow time to switch windows
print("chờ 3s")
time.sleep(3)
controller = ScriptController()

target_colors = [(205, 219, 0)]
steps = 5

print("""nhấn "[" để chạy, "]" để dừng và "esc" để thoát""")
while True:
    controller.check_exit()

    if controller.running:
        flag = 0
        pic = pyautogui.screenshot(region=(top_left_x, top_left_y, width_specific, height_specific))
        width, height = pic.size

        for x in range(0, width, steps):
            for y in range(0, height, steps):
                r, g, b = pic.getpixel((x, y))

                # Kiểm tra nếu màu pixel khớp với bất kỳ màu mục tiêu nào
                for target_r, target_g, target_b in target_colors:
                    if color_match(r, g, b, target_r, target_g, target_b):
                        flag = 1
                        clicker_pos(x + top_left_x, y + top_left_y)
                        # time.sleep(0.03)
                        break

                if flag == 1:
                    break

            if flag == 1:
                break

    # Nghỉ ngắn để giảm tải CPU
    time.sleep(0.01)
