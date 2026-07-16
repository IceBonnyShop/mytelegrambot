import telebot
from telebot import types

import json
import random
import string
import os


# ==========================
# НАСТРОЙКИ
# ==========================

TOKEN = "8793105635:AAEP_zCJXx9XkP-M0CwlkgBW83s-LeSSsM0"

ADMIN_ID = 5508951976

BOT_USERNAME = "IceBonnyShop_bot"

bot = telebot.TeleBot(TOKEN)

# ==========================
# ДАННЫЕ
# ==========================

users = set()

orders = {}

waiting_promocode = {}

used_promocodes = {}

# Реферальная система
referrals = {}

invited_by = {}

promocodes = {
    "WELCOME": True,
    "ICEBONNY": True,
    "ROBLOX": True
}

ROBLOX_PRODUCTS = {
    "robux40": "40 Robux",
    "robux80": "80 Robux",
    "robux400": "400 Robux",
    "robux800": "800 Robux",
    "robux1200": "1200 Robux",
    "robux1700": "1700 Robux",
    "robux3150": "3150 Robux",
    "robux4500": "4500 Robux"
}

# ==========================
# CODES.JSON
# ==========================

CODES_FILE = "codes.json"


def load_codes():

    if not os.path.exists(CODES_FILE):
        return {}

    with open(CODES_FILE, "r", encoding="utf-8") as f:

        try:
            return json.load(f)
        except:
            return {}


def save_codes(codes):

    with open(CODES_FILE, "w", encoding="utf-8") as f:
        json.dump(codes, f, ensure_ascii=False, indent=4)


def generate_code():

    while True:

        code = "IB-" + "".join(
            random.choices(
                string.ascii_uppercase + string.digits,
                k=6
            )
        )

        codes = load_codes()

        if code not in codes:
            return code

# ==========================
# START
# ==========================

@bot.message_handler(commands=["start"])
def start(message):

    users.add(message.from_user.id)

    args = ""

    if len(message.text.split()) > 1:
        args = message.text.split()[1]

    # ==========================
    # ПРОВЕРКА КОДОВ
    # ==========================

    codes = load_codes()

    if args in codes:

        prize = codes[args]

        del codes[args]

        save_codes(codes)

        bot.send_message(
            message.chat.id,
            f"""🎉 Поздравляем!

Вы получили приз:

{prize}

Спасибо за участие ❤️"""
        )

        return

    # ==========================
    # РЕФЕРАЛЬНАЯ СИСТЕМА
    # ==========================

    if args.isdigit():

        inviter = int(args)

        if inviter != message.from_user.id:

            if message.from_user.id not in invited_by:

                invited_by[message.from_user.id] = inviter

                if inviter not in referrals:
                    referrals[inviter] = 0

                referrals[inviter] += 1

                bot.send_message(
                    inviter,
                    f"""🎉 Новый приглашённый!

👤 {message.from_user.first_name}

👥 Всего друзей:
{referrals[inviter]}
"""
                )

    # ==========================
    # ПОКУПКА ROBUX
    # ==========================

    if args in ROBLOX_PRODUCTS:

        product = ROBLOX_PRODUCTS[args]

        orders[message.from_user.id] = product

        keyboard = types.InlineKeyboardMarkup()

        keyboard.row(
            types.InlineKeyboardButton(
                "✅ Принять",
                callback_data=f"accept_{message.from_user.id}"
            ),
            types.InlineKeyboardButton(
                "❌ Отклонить",
                callback_data=f"decline_{message.from_user.id}"
            )
        )

        bot.send_message(
            ADMIN_ID,
            f"""🆕 Новый заказ!

🎮 Roblox

💎 Товар:
{product}

👤 Пользователь:
{message.from_user.first_name}

🆔 ID:
{message.from_user.id}
""",
            reply_markup=keyboard
        )

        bot.send_message(
            message.chat.id,
            "✅ Заявка отправлена администратору.\n\nОжидайте ответа."
        )

        return

    keyboard = types.ReplyKeyboardMarkup(resize_keyboard=True)

    keyboard.add(types.KeyboardButton("🛒 Магазин"))

    keyboard.row(
        types.KeyboardButton("🎁 Промокоды"),
        types.KeyboardButton("👤 Профиль")
    )

    keyboard.row(
        types.KeyboardButton("💬 Поддержка")
    )

    photo = open("images/logo.png", "rb")

    bot.send_photo(
        message.chat.id,
        photo,
        caption="""
👋 Добро пожаловать в IceBonny Shop!

🔥 Самые низкие цены.
⚡ Быстрая выдача.
🛡️ Безопасная покупка.

👇 Выберите действие ниже:
""",
        reply_markup=keyboard
    )
    # ==========================
# МАГАЗИН
# ==========================

@bot.message_handler(func=lambda m: m.text == "🛒 Магазин")
def shop(message):

    keyboard = types.InlineKeyboardMarkup()

    keyboard.add(
        types.InlineKeyboardButton(
            "🌐 Перейти в магазин",
            url="https://icebonnyshop.github.io/mytelegrambot/"
        )
    )

    bot.send_message(
        message.chat.id,
        "🛒 *IceBonny Shop*\n\nНажмите кнопку ниже, чтобы открыть магазин.",
        parse_mode="Markdown",
        reply_markup=keyboard
    )


# ==========================
# ПРОФИЛЬ
# ==========================

@bot.message_handler(func=lambda m: m.text == "👤 Профиль")
def profile(message):

    purchases = 0

    if message.from_user.id in orders:
        purchases = 1

    invited = referrals.get(message.from_user.id, 0)

    bot.send_message(
        message.chat.id,
        f"""👤 Ваш профиль

🆔 ID:
{message.from_user.id}

👤 Имя:
{message.from_user.first_name}

💰 Баланс:
0 ⭐

🛍 Заказов:
{purchases}

👥 Приглашено друзей:
{invited}

🔗 Ваша реферальная ссылка:

https://t.me/{BOT_USERNAME}?start={message.from_user.id}
"""
    )


# ==========================
# ПОДДЕРЖКА
# ==========================

@bot.message_handler(func=lambda m: m.text == "💬 Поддержка")
def support(message):

    bot.send_message(
        message.chat.id,
        "💬 Поддержка\n\nTelegram: @IceBonnyShop"
    )
    # ==========================
# ПРОМОКОДЫ
# ==========================

@bot.message_handler(func=lambda m: m.text == "🎁 Промокоды")
def promo(message):

    waiting_promocode[message.from_user.id] = True

    bot.send_message(
        message.chat.id,
        "🎁 Введите промокод:"
    )


@bot.message_handler(func=lambda m: m.from_user.id in waiting_promocode)
def check_promocode(message):

    code = message.text.upper()

    if code not in promocodes:

        bot.send_message(
            message.chat.id,
            "❌ Такого промокода не существует."
        )

        return

    if message.from_user.id not in used_promocodes:
        used_promocodes[message.from_user.id] = []

    if code in used_promocodes[message.from_user.id]:

        bot.send_message(
            message.chat.id,
            "❌ Вы уже использовали этот промокод."
        )

        del waiting_promocode[message.from_user.id]

        return

    used_promocodes[message.from_user.id].append(code)

    del waiting_promocode[message.from_user.id]

    keyboard = types.InlineKeyboardMarkup()

    keyboard.add(
        types.InlineKeyboardButton(
            "🎡 Крутить колесо",
            url="https://icebonnyshop.github.io/mytelegrambot/wheel.html"
        )
    )

    bot.send_message(
        message.chat.id,
        f"""✅ Промокод {code} успешно активирован!

🎉 Теперь можно открыть Колесо Фортуны.""",
        reply_markup=keyboard
    )
    # ==========================
# КНОПКИ АДМИНА
# ==========================

@bot.callback_query_handler(func=lambda call: True)
def callbacks(call):

    if call.from_user.id != ADMIN_ID:

        bot.answer_callback_query(
            call.id,
            "⛔ Нет доступа."
        )

        return

    data = call.data

    # ==========================
    # ПРИНЯТЬ ЗАКАЗ
    # ==========================

    if data.startswith("accept_"):

        user_id = int(data.split("_")[1])

        product = orders.get(user_id, "Неизвестно")

        bot.send_message(
            user_id,
            f"""✅ Ваш заказ принят!

🎮 Roblox

💎 {product}

Ожидайте дальнейших инструкций от администратора.
"""
        )

        bot.edit_message_text(
            f"""✅ Заказ принят

👤 ID: {user_id}

💎 {product}
""",
            chat_id=call.message.chat.id,
            message_id=call.message.message_id
        )

        bot.answer_callback_query(
            call.id,
            "Заказ принят."
        )

    # ==========================
    # ОТКЛОНИТЬ ЗАКАЗ
    # ==========================

    elif data.startswith("decline_"):

        user_id = int(data.split("_")[1])

        product = orders.get(user_id, "Неизвестно")

        bot.send_message(
            user_id,
            f"""❌ Ваш заказ отклонён.

💎 {product}

Если это ошибка — свяжитесь с поддержкой.
"""
        )

        bot.edit_message_text(
            f"""❌ Заказ отклонён

👤 ID: {user_id}

💎 {product}
""",
            chat_id=call.message.chat.id,
            message_id=call.message.message_id
        )

        bot.answer_callback_query(
            call.id,
            "Заказ отклонён."
        )
        # ==========================
# СОЗДАТЬ КОД
# ==========================

@bot.message_handler(commands=["createcode"])
def create_code(message):

    if message.from_user.id != ADMIN_ID:
        return

    args = message.text.split()

    if len(args) < 2:

        bot.send_message(
            message.chat.id,
            "Использование:\n/createcode discount5"
        )

        return

    prize = args[1]

    code = generate_code()

    codes = load_codes()

    codes[code] = prize

    save_codes(codes)

    bot.send_message(
        message.chat.id,
        f"""✅ Код создан!

🔑 {code}

🎁 Приз:
{prize}
"""
    )
# ========================== 
# ЗАПУСК БОТА
# ==========================

print("🚀 IceBonny Bot запущен!")

bot.infinity_polling(skip_pending=True)