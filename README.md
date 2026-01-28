# Campimetry App 👁️

> Веб-приложение для автоматизированной статической периметрии — исследования поля зрения в домашних условиях

[![GitHub Pages](https://img.shields.io/badge/demo-live-success)](https://sergeypristavko.github.io/campimetry-app/)
[![Documentation](https://img.shields.io/badge/docs-online-blue)](https://sergeypristavko.github.io/campimetry-app/docs/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🎯 Описание

Приложение для проведения периметрии (кампиметрии) — метода исследования поля зрения для выявления скотом (слепых пятен) и оценки светочувствительности сетчатки. Используется для скрининга глаукомы, макулярной дегенерации и неврологических заболеваний.

**Основные возможности:**
- ✅ Калибровка экрана с помощью кредитной карты
- ✅ Паттерны тестирования: 24-2, 10-2, 30-2
- ✅ Пороговая и надпороговая стратегии
- ✅ Статистические показатели: MD, PSD, VFI, GHT
- ✅ История тестов и экспорт в PDF
- ✅ Работает полностью в браузере (без сервера)

## 📖 Документация

**[📚 Полная продуктовая документация →](https://sergeypristavko.github.io/campimetry-app/docs/)**

Документация содержит:
- Медицинский контекст и клиническое применение
- Детальное описание алгоритмов (Staircase 4-2)
- Научные обоснования всех параметров
- Формулы расчёта статистических показателей
- Ссылки на научные статьи и стандарты

## 🚀 Быстрый старт

### Локальная разработка

```bash
# Клонировать репозиторий
git clone https://github.com/sergeypristavko/campimetry-app.git
cd campimetry-app

# Установить зависимости
npm install

# Запустить dev сервер
npm run dev
```

Приложение откроется на `http://localhost:5173`

### Сборка

```bash
# Сборка для production
npm run build

# Предпросмотр production-сборки
npm run preview
```

Результат сборки — единственный файл `dist/index.html` (single-file bundle) и папка `dist/docs/` с документацией.

## 🏗️ Технологии

- **Frontend:** React 19 + TypeScript
- **Build:** Vite 7 + vite-plugin-singlefile
- **Styling:** Tailwind CSS
- **Docs:** Docsify (markdown-based)
- **Deploy:** GitHub Pages

## 📁 Структура проекта

```
campimetry-app/
├── src/
│   ├── components/        # React компоненты
│   │   ├── screens/       # Экраны приложения
│   │   └── ui/            # UI-компоненты
│   ├── hooks/             # Custom хуки
│   ├── utils/             # Утилиты и алгоритмы
│   │   ├── algorithms.ts       # Staircase 4-2
│   │   ├── gridPatterns.ts     # Паттерны точек
│   │   ├── statistics.ts       # MD, PSD, VFI, GHT
│   │   ├── normalValues.ts     # Возрастные нормы
│   │   └── calibration.ts      # Калибровка экрана
│   └── types/             # TypeScript типы
├── public/
│   └── docs/              # Документация (Docsify)
│       ├── index.html           # Docsify entry
│       ├── README.md            # Главная страница
│       ├── product-spec.md      # Продуктовая спецификация
│       └── _sidebar.md          # Навигация
└── CLAUDE.md              # Инструкции для Claude Code

```

## 🔬 Научная база

Приложение основано на клинических стандартах автоматизированной статической периметрии:

- **Паттерны:** Humphrey Field Analyzer (24-2, 10-2, 30-2)
- **Размер стимула:** Goldmann III (0.431°)
- **Алгоритм:** Staircase 4-2 (начало 24 dB, шаг 4→2 dB, 2 реверса)
- **Статистика:** Anderson & Patella (1999), Bengtsson & Heijl (2008)
- **Нормы:** Возрастная коррекция -0.7 dB/10 лет

Полные ссылки на научные статьи — в [документации](https://sergeypristavko.github.io/campimetry-app/docs/#/product-spec).

## ⚠️ Медицинский дисклеймер

**Данное приложение предназначено ТОЛЬКО для:**
- Образовательных целей
- Самоскрининга и мониторинга
- Дополнения к клиническому обследованию

**Приложение НЕ заменяет:**
- Профессиональную диагностику офтальмолога
- Клиническую периметрию (Humphrey Field Analyzer, Octopus)
- Комплексное офтальмологическое обследование (ОКТ, тонометрия, биомикроскопия)

⚕️ **При обнаружении дефектов поля зрения обязательно обратитесь к врачу-офтальмологу!**

## 🧪 Тестирование

```bash
# Линтинг
npm run lint

# Type checking
npm run typecheck

# Полная проверка (lint + typecheck + build)
npm run build
```

## 📄 Лицензия

MIT License — свободное использование с указанием авторства.

## 🤝 Контрибьютинг

Пул-реквесты приветствуются! Для крупных изменений сначала откройте issue для обсуждения.

## 📞 Контакты

- 🐛 [Сообщить об ошибке](https://github.com/sergeypristavko/campimetry-app/issues)
- 💡 [Предложить улучшение](https://github.com/sergeypristavko/campimetry-app/issues)
- 📚 [Документация](https://sergeypristavko.github.io/campimetry-app/docs/)

---

**Версия:** 1.0 | **Дата:** 28 января 2026
