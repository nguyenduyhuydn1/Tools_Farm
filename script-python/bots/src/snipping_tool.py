import tkinter as tk
from PIL import ImageGrab
import ctypes

# Lấy độ phân giải của màn hình
user32 = ctypes.windll.user32
screen_width = user32.GetSystemMetrics(0)
screen_height = user32.GetSystemMetrics(1)


class SnippingTool:
    def __init__(self, root):
        self.root = root
        self.start_x = None
        self.start_y = None
        self.rect = None
        self.color = None
        self.width = 0
        self.height = 0

        # Tạo canvas để thực hiện kéo chọn khung hình
        self.canvas = tk.Canvas(self.root, cursor="cross", bg="grey", highlightthickness=0)
        self.canvas.pack(fill=tk.BOTH, expand=True)

        # Làm cho cửa sổ Tkinter trong suốt
        self.root.attributes("-alpha", 0.3)  # Đặt độ trong suốt cho cửa sổ (0.0 đến 1.0)
        self.root.overrideredirect(True)  # Loại bỏ viền cửa sổ

        # Lắng nghe các sự kiện chuột
        self.canvas.bind("<ButtonPress-1>", self.on_mouse_down)
        self.canvas.bind("<B1-Motion>", self.on_mouse_drag)
        self.canvas.bind("<ButtonRelease-1>", self.on_mouse_up)

        # Chụp màn hình toàn bộ để xử lý sau
        self.screenshot = ImageGrab.grab(bbox=(0, 0, screen_width, screen_height))

    def on_mouse_down(self, event):
        # Lưu tọa độ khi bắt đầu click
        self.start_x = self.canvas.canvasx(event.x)
        self.start_y = self.canvas.canvasy(event.y)

        # Lấy màu tại điểm bắt đầu click
        self.color = self.screenshot.getpixel((int(self.start_x), int(self.start_y)))

        # Vẽ hình chữ nhật tại điểm bắt đầu click
        if self.rect:
            self.canvas.delete(self.rect)
        self.rect = self.canvas.create_rectangle(self.start_x, self.start_y, self.start_x, self.start_y, outline="red", width=2)

    def on_mouse_drag(self, event):
        # Cập nhật kích thước khung hình khi kéo chuột
        cur_x = self.canvas.canvasx(event.x)
        cur_y = self.canvas.canvasy(event.y)
        self.canvas.coords(self.rect, self.start_x, self.start_y, cur_x, cur_y)

    def on_mouse_up(self, event):
        # Khi thả chuột, tính chiều rộng và chiều cao
        end_x = self.canvas.canvasx(event.x)
        end_y = self.canvas.canvasy(event.y)
        self.width = abs(end_x - self.start_x)
        self.height = abs(end_y - self.start_y)

        # Tự động tắt ứng dụng khi nhả chuột
        self.root.quit()
        self.root.destroy()

    def get_rectangle_info(self):
        """Hàm trả về tọa độ góc trên bên trái, chiều rộng và chiều cao"""
        return (self.color, self.start_x, self.start_y, self.width, self.height)


def run_snipping_tool():
    # Khởi tạo ứng dụng Tkinter toàn màn hình
    root = tk.Tk()
    root.attributes("-fullscreen", True)  # Đặt ứng dụng toàn màn hình
    app = SnippingTool(root)
    root.mainloop()

    # Trả về các giá trị cần thiết sau khi hoàn thành
    return app.get_rectangle_info()


# Chỉ chạy ứng dụng khi file được chạy trực tiếp
if __name__ == "__main__":
    color, top_left_x, top_left_y, width, height = run_snipping_tool()
    print(f"Color at start: {color}")
    print(f"X Y corner: ({top_left_x}, {top_left_y})")
    print(f"Width: {width}")
    print(f"Height: {height}")
