from selenium import webdriver
import os

options = webdriver.ChromeOptions()
options.add_argument("--start-maximized")
options.add_experimental_option("excludeSwitches", ["enable-automation"])
options.add_experimental_option("useAutomationExtension", False)
options.add_argument(rf"--user-data-dir=C:\Users\Huy\AppData\Local\Google\Chrome\User Data\Profile 111")
driver = webdriver.Chrome(options=options)


def read_lines_to_array():
    if not os.path.exists("1.txt"):
        raise FileNotFoundError("The file 'localStorage.txt' does not exist.")

    with open("1.txt", "r", encoding="utf-8") as file:
        lines = file.read().strip().split("\n")

    array = []
    for line in lines:
        obj = {}
        key_value_pairs = line.split("\t")
        for pair in key_value_pairs:
            if pair:
                key, value = pair.split(": ", 1)
                obj[key] = value
        array.append(obj)

    return array


arr = read_lines_to_array()

driver.get("https://web.telegram.org/")

# for key, value in arr[0].items():
#     driver.execute_script(f"window.localStorage.setItem('{key}', '{value}');")


input("Nhấn Enter để đóng trình duyệt...")

