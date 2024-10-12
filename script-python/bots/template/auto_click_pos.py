# import pyautogui
# import keyboard
# import time

# # Define the positions where you want to click
# click_positions = [
#     (200, 300),
#     (600, 300),
#     (200, 980),
#     (600, 980),
# ]


# def auto_click():
#     try:
#         while not keyboard.is_pressed("p"):
#             for pos in click_positions:
#                 # pyautogui.moveTo(pos, duration=0.1)
#                 pyautogui.click(pos)
#                 # time.sleep(0.01)
#             time.sleep(0.01)

#     except KeyboardInterrupt:
#         print("Program terminated.")


# print("Press 'o' to start auto click and hold 'p' to stop.")
# while True:
#     if keyboard.is_pressed("o"):
#         print("Auto clicker started.")
#         auto_click()
#         print("Auto clicker stopped.")
#         break  # Exit the loop after one run if needed
import pyautogui
import keyboard
import time

# Define the positions where you want to click
click_positions = [
    (200, 300),
    (600, 300),
    (200, 980),
    (600, 980),
]

# Flags to track whether to skip a position
skip_flags = [False, False, False, False]


def auto_click():
    try:
        while not keyboard.is_pressed("p"):
            # Check for key presses to toggle skip_flags
            check_key_presses()

            for i, pos in enumerate(click_positions):
                # Check if the position should be skipped
                if skip_flags[i]:
                    continue
                pyautogui.click(pos)
            time.sleep(0.1)  # Delay to avoid excessive clicking

    except KeyboardInterrupt:
        print("Program terminated.")


def check_key_presses():
    # Toggle skip_flags when corresponding keys (1, 2, 3, 4) are pressed
    for i in range(4):
        if keyboard.is_pressed(str(i + 1)):
            skip_flags[i] = not skip_flags[i]  # Toggle the flag
            print(f"Toggle click at position {i + 1}: {'Off' if skip_flags[i] else 'On'}")
            time.sleep(0.3)  # Small delay to avoid multiple toggles for a single press


print("Press 'o' to start auto click, hold 'p' to stop.")
print("Press 1, 2, 3, 4 to toggle click at the corresponding position.")

while True:
    if keyboard.is_pressed("o"):
        print("Auto clicker started.")
        auto_click()
        print("Auto clicker stopped.")
        break
