import keyboard
import sys


class ScriptController:
    def __init__(self):
        # Biến để theo dõi trạng thái chạy
        self.running = False

        # Thiết lập phím tắt
        keyboard.add_hotkey("[", self.start)
        keyboard.add_hotkey("]", self.stop)

    def get_running(self):
        return self.running

    def set_running(self, state):
        """Thiết lập trạng thái chạy của script."""
        self.running = state
        print(f"Script {'started' if state else 'stopped'}")

    def start(self):
        """Bắt đầu chạy script."""
        self.set_running(True)

    def stop(self):
        """Dừng chạy script."""
        self.set_running(False)

    def check_exit(self):
        """Kiểm tra nếu phím ESC được nhấn để thoát chương trình."""
        if keyboard.is_pressed("esc"):
            sys.exit()
