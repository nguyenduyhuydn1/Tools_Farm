import pyautogui as pt
import time


class Clicker:
    def __init__(self, target_png, speed):
        self.target_png = target_png
        self.speed = speed
        pt.FAILSAFE = True

    def nav_to_image(self):
        try:
            pos = pt.locateOnScreen(self.target_png, confidence=0.6)
            pt.moveTo(pos[0] + 15, pos[1] + 15, duration=self.speed)
            pt.click()
        except:
            print("no image")


if __name__ == "__main__":
    time.sleep(3)
    clicker = Clicker(r"C:\Users\huy\Pictures\Screenshots\1.png", speed=0.01)
    end = 0
    while True:
        if clicker.nav_to_image() == 0:
            end += 1
        if end > 20:
            break
