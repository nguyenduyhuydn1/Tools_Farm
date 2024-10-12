from module.auto_clicker import win32_click
from module.control import ScriptController

from pyautogui import *
import time


controller = ScriptController()

print("""nhấn "[" để chạy, "]" để dừng và "esc" để thoát""")

while True:
    controller.check_exit()

    if controller.running:
        win32_click()
        time.sleep(0.05)

    time.sleep(0.01)
