import type { LectureModule } from './schema';
import { topic } from './module-1';

export const module2: LectureModule = {
  id: 'module-2',
  title: 'Module 2: Exceptions, I/O, Algorithms, Collections',
  targetDurationMinutes: 60,
  audienceLevel: 'Java interns',
  isAvailable: false,
  lockedReason: 'Недоступно',
  summary:
    'Исключения и обработка ошибок, I/O и try-with-resources, сериализация, базовая алгоритмика (Big O, сортировки), generics, коллекции и основы Stream API.',
  topics: [
    topic({
      id: 'exceptions-basics',
      title: 'Исключения: зачем и как ими пользоваться',
      quickAnswer:
        'Исключение — это сигнал об ошибке или нестандартной ситуации. В Java различают проверяемые и непроверяемые исключения; важно не «прятать» ошибку, а корректно сообщать о ней и оставлять контекст.',
      explainBrief: [
        'Исключение передает управление вверх по стеку вызовов до ближайшего подходящего `catch`.',
        'Три базовых блока: `try` (опасный код), `catch` (обработка), `finally` (финализация).',
        'Исключения нужны, чтобы не продолжать работу в некорректном состоянии и не размазывать проверки по коду.',
        'Важно различать «ошибка программиста» (обычно `RuntimeException`) и ожидаемая бизнес/инфраструктурная ошибка.',
        'Правило практики: добавлять контекст в сообщение/лог, но не терять исходную причину (cause).',
        'Не стоит использовать исключения как обычный контроль потока (например, для ветвления на «не найдено» в коллекции).',
        'Исключения уместны на границах с внешним миром: DB, HTTP, Kafka и любая нестабильная интеграция, где возможны таймауты и ошибки сети.',
        'Исключения уместны, когда нарушен инвариант или обнаружено unexpected state: продолжать выполнение опасно, потому что данные/логика уже неконсистентны.',
        'Исключения уместны для ошибок, которые нельзя игнорировать: если нет корректного fallback/компенсации, лучше упасть с понятным контекстом.',
      ],
      interviewFocus: [
        {
          question: 'Зачем в Java вообще нужны исключения, если можно возвращать `null`/код ошибки?',
          expectedAnswer:
            'Исключения отделяют «нормальный» путь от обработки ошибок, не требуют проверять код после каждого вызова и сохраняют стек вызовов для диагностики.',
        },
        {
          question: 'Что значит «потерять исключение» и почему это плохо?',
          expectedAnswer:
            'Если перехватить и не пробросить дальше или заменить на другое без cause, теряется причина и стек; дебаг становится сложнее, а ошибка может маскироваться.',
        },
      ],
      codeExample: {
        title: 'Обогащение контекста и сохранение cause',
        language: 'java',
        snippet: `public class OrderService {
    public void placeOrder(String userId) {
        try {
            // ... вызов внешнего сервиса/БД ...
            throw new IllegalStateException("DB timeout");
        } catch (RuntimeException ex) {
            throw new OrderPlacementException("Не удалось оформить заказ для userId=" + userId, ex);
        }
    }
}

class OrderPlacementException extends RuntimeException {
    public OrderPlacementException(String message, Throwable cause) {
        super(message, cause);
    }
}`,
        walkthrough: [
          'В `catch` добавляется бизнес-контекст (какой пользователь, какая операция).',
          'Исходное исключение передается как cause, чтобы не потерять детали и стек.',
        ],
        commonPitfall: 'Поймать `Exception` и вернуть «всё ок» или кинуть новое исключение без cause.',
        productionNote:
          'В проде важно логировать причины ошибок и добавлять корреляцию (requestId), но не раскрывать чувствительные данные в сообщениях.',
      },
      glossary: [
        { term: 'Stack trace', meaning: 'Стек вызовов, показывающий, где и как ошибка дошла до текущей точки.' },
        { term: 'Cause', meaning: 'Исходная причина исключения, которую важно сохранять при оборачивании.' },
      ],
      estimatedMinutes: 4,
    }),

    topic({
      id: 'exception-hierarchy',
      title: 'Иерархия исключений: Error, Exception, RuntimeException',
      simpleDefinitionOverride:
        '`Throwable` — вершина иерархии: от него наследуются и ошибки (`Error`), и исключения (`Exception`). `Error` — критические сбои JVM/окружения, которые приложение обычно не умеет «чинить». `Exception` — ошибки, с которыми код может работать: часть из них checked (компилятор заставляет обработать), а `RuntimeException` — unchecked (чаще про нарушение контракта и некорректное состояние).',
      quickAnswer:
        '`Throwable` делится на `Error` (ошибки JVM/окружения) и `Exception`. `Exception` включает проверяемые исключения и `RuntimeException` — непроверяемые, обычно про ошибки кода или невозможность продолжать выполнение.',
      explainBrief: [
        '`Error` — это проблемы уровня JVM/железа/окружения (например, OutOfMemoryError): чаще всего можно только корректно завершиться и оставить диагностику.',
        'Проверяемые исключения (checked) должны быть объявлены в `throws` или обработаны в `catch`.',
        'Непроверяемые (unchecked) — наследники `RuntimeException`, компилятор их не требует объявлять.',
        'Checked удобно применять для действительно ожидаемых, восстановимых ситуаций (например, работа с файлами).',
        'Unchecked — для нарушений контрактов и ошибок программирования (например, `NullPointerException`, `IllegalArgumentException`).',
        'Выбор типа исключения влияет на API: checked «заражает» сигнатуры и заставляет выстраивать обработку.',
      ],
      interviewFocus: [
        {
          question: 'В чем разница checked и unchecked исключений?',
          expectedAnswer:
            'Checked должны быть обработаны/объявлены компилятором; unchecked — нет. Unchecked чаще для ошибок кода/контракта, checked — для ожидаемых восстановимых ошибок.',
        },
        {
          question: 'Нужно ли ловить `Error`?',
          expectedAnswer:
            'Обычно нет. Можно логировать на самом верхнем уровне (uncaught handler), но приложение часто не может корректно продолжать работу после `Error`.',
        },
      ],
      codeExample: {
        title: 'Checked vs unchecked в сигнатуре',
        language: 'java',
        snippet: `/*
Throwable
├─ Error
│  ├─ OutOfMemoryError
│  └─ StackOverflowError
└─ Exception
   ├─ IOException            (checked)
   └─ RuntimeException       (unchecked)
      ├─ IllegalArgumentException
      └─ NullPointerException
*/

import java.io.IOException;

public class FilesApi {
    public String readText() throws IOException {
        throw new IOException("Файл не найден");
    }

    public void validateAge(int age) {
        if (age < 0) {
            throw new IllegalArgumentException("Возраст не может быть отрицательным");
        }
    }
}`,
        walkthrough: [
          '`IOException` — checked, поэтому метод обязан объявить `throws IOException` или обработать внутри.',
          '`IllegalArgumentException` — unchecked, используется для нарушения предусловий.',
        ],
        commonPitfall: 'Делать почти все исключения checked и заставлять «пробрасывать» их через весь код без смысла.',
      },
      glossary: [
        { term: 'Throwable', meaning: 'Базовый класс для всех ошибок и исключений в Java.' },
        { term: 'Checked exception', meaning: 'Проверяемое исключение, обязательное к обработке или объявлению.' },
        { term: 'Unchecked exception', meaning: 'Непроверяемое исключение (обычно `RuntimeException`).' },
      ],
      estimatedMinutes: 4,
    }),

    topic({
      id: 'exception-handling-strategies',
      title: 'Способы обработки исключений: перехват, проброс, оборачивание',
      simpleDefinitionOverride:
        'Обработка исключений — это решение «что делать с ошибкой» на правильном уровне: либо восстановиться (retry/fallback), либо пробросить выше, либо обернуть в более понятное исключение с контекстом, сохранив причину (cause).',
      quickAnswer:
        'Основные стратегии: обработать на месте (если понятно, как восстановиться), пробросить выше (если решение на верхнем уровне), обернуть в доменное/техническое исключение с контекстом, сохранив cause.',
      explainBrief: [
        'Ловить стоит там, где есть возможность корректно обработать или добавить осмысленный контекст.',
        'На границе слоя (контроллер/адаптер) часто делают преобразование исключений в понятный для слоя формат.',
        'Оборачивание сохраняет причину (`new X(message, ex)`) и добавляет контекст операции.',
        'Не стоит ловить слишком широкий тип (`Throwable`, `Exception`) без причины.',
        'В `catch` не должно быть пустых блоков: минимум — лог + корректное решение (повтор, fallback, проброс).',
        'Важно не «дублировать» логирование: если уровень выше всё равно логирует, на нижнем уровне можно ограничиться контекстом.',
        'Типовой сценарий DB: `SQLException`/ошибка драйвера → обернуть в исключение репозитория/сервиса с контекстом (какая операция и по каким данным), сохранить cause.',
        'Типовой сценарий HTTP: таймаут/5xx → если операция идемпотентна, можно сделать ограниченный retry; если нет — обернуть и пробросить выше.',
        'Типовой сценарий Kafka: временная недоступность брокера/timeout → чаще нужна стратегия повторов и DLQ, а не «поймал и продолжил».',
      ],
      interviewFocus: [
        {
          question: 'Где лучше ловить исключения: внизу или на верхнем уровне?',
          expectedAnswer:
            'Ловить там, где есть действие: либо можно восстановиться (retry/fallback), либо можно добавить смысл (контекст операции) и пробросить выше. Часто репозиторий/адаптер ловит низкоуровневую ошибку (SQL/HTTP) и оборачивает её в исключение своего слоя, сервис добавляет бизнес-контекст, а на самом верхнем уровне делают единый маппинг в HTTP-ответ/лог.',
        },
        {
          question: 'Почему опасно ловить `Exception` и продолжать выполнение?',
          expectedAnswer:
            'Так легко «проглотить» реальную причину и продолжить в некорректном состоянии: часть данных могла не сохраниться, интеграция могла не отработать, инварианты могли сломаться. В итоге ошибка всплывает позже и в другом месте, а отладка превращается в угадайку, потому что исходный stack trace и контекст потеряны.',
        },
      ],
      codeExample: {
        title: 'Обработка на месте vs проброс выше',
        language: 'java',
        snippet: `public class RetryExample {
    public String callWithRetry(RemoteClient client) {
        try {
            return client.call();
        } catch (RemoteTimeoutException ex) {
            return client.call(); // один повтор как простейшая стратегия
        }
    }
}

interface RemoteClient {
    String call();
}

class RemoteTimeoutException extends RuntimeException { }`,
        walkthrough: [
          'Если есть простая стратегия восстановления (повтор) — можно обработать локально.',
          'Если стратегии нет — лучше пробросить выше с контекстом.',
        ],
        commonPitfall: 'Ловить всё подряд и «гасить» исключения без реакции.',
        productionNote:
          'В реальных системах повтор должен быть ограничен, с backoff и учетом идемпотентности, иначе можно усилить проблему.',
      },
      glossary: [
        { term: 'Wrap', meaning: 'Оборачивание исключения в другое, более подходящее для слоя/домена.' },
        { term: 'Boundary', meaning: 'Граница слоя, где часто делают перевод ошибок в формат слоя.' },
      ],
      estimatedMinutes: 4,
    }),

    topic({
      id: 'try-with-resources',
      title: 'Try-with-resources: безопасное закрытие ресурсов',
      quickAnswer:
        '`try-with-resources` автоматически закрывает ресурсы, реализующие `AutoCloseable`. Это снижает риск утечек и упрощает код по сравнению с ручным `finally { close(); }`.',
      explainBrief: [
        'Ресурс закрывается автоматически в конце блока `try`, даже если выброшено исключение.',
        'Можно объявлять несколько ресурсов: они закроются в обратном порядке объявления.',
        'Если при закрытии тоже возникает исключение, оно может попасть в suppressed исключения.',
        '`try-with-resources` безопаснее и короче, чем ручной `close()` в `finally`.',
        'Подходит для `InputStream`, `Reader`, `Connection`, `PreparedStatement` и т.д.',
        'Важно: закрытие ресурса не гарантирует «успех операции», оно лишь освобождает системные ресурсы.',
      ],
      interviewFocus: [
        {
          question: 'Что даёт try-with-resources по сравнению с finally?',
          expectedAnswer:
            'Автоматическое закрытие, корректная обработка исключений при закрытии (suppressed), меньше шаблонного кода и меньше шансов забыть `close()`.',
        },
        {
          question: 'В каком порядке закрываются несколько ресурсов?',
          expectedAnswer: 'В обратном порядке объявления (LIFO).',
        },
      ],
      codeExample: {
        title: 'Чтение файла через try-with-resources',
        language: 'java',
        snippet: `import java.io.BufferedReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

public class FileRead {
    public String readFirstLine(Path path) throws IOException {
        try (BufferedReader reader = Files.newBufferedReader(path, StandardCharsets.UTF_8)) {
            return reader.readLine();
        }
    }
}`,
        walkthrough: [
          'Ридер создаётся в заголовке `try` и гарантированно закрывается.',
          'Сигнатура оставляет `IOException` как checked-ошибку работы с файлом.',
        ],
        commonPitfall: 'Создать поток и забыть закрыть его (утечки дескрипторов файлов).',
      },
      glossary: [
        { term: 'AutoCloseable', meaning: 'Интерфейс для ресурсов, которые нужно закрывать (метод `close()`).' },
        { term: 'Suppressed', meaning: 'Исключение при закрытии ресурса, добавленное к основному как suppressed.' },
      ],
      estimatedMinutes: 4,
    }),

    topic({
      id: 'io-overview',
      title: 'Ввод-вывод: чем отличаются байтовые и символьные потоки',
      quickAnswer:
        'I/O в Java строится на потоках. Байтовые (`InputStream`/`OutputStream`) работают с сырыми байтами, символьные (`Reader`/`Writer`) — с текстом и кодировками. Для производительности используют буферизацию.',
      explainBrief: [
        'Байт-уровень (`InputStream`/`OutputStream`) подходит для бинарных данных: картинки, архивы, файлы, сеть, шифрование.',
        'Текстовый уровень (`Reader`/`Writer`) нужен для строк; корректная кодировка критична.',
        'Буферизация (`BufferedInputStream`, `BufferedReader`) снижает число системных вызовов.',
        '`flush()` нужен, чтобы протолкнуть буфер в целевой поток; `close()` обычно делает flush.',
        'NIO (`java.nio.file.Files`) часто проще и безопаснее для файловых операций.',
        'Исключения I/O чаще checked (`IOException`), поэтому нужна стратегия обработки.',
      ],
      interviewFocus: [
        {
          question: 'Когда выбирать InputStream, а когда Reader?',
          expectedAnswer:
            'InputStream/OutputStream выбирают, когда нужны сырые байты: файлы-архивы, изображения, сеть, шифрование. Reader/Writer — когда задача про текст: тогда сразу фиксируют кодировку (например UTF-8), чтобы не получить «кракозябры» и баги при запуске на другой ОС.',
        },
        {
          question: 'Зачем нужен BufferedReader/BufferedInputStream?',
          expectedAnswer:
            'Буферизация уменьшает число обращений к ОС: вместо чтения по одному байту/символу читают блоками. Это обычно резко ускоряет I/O и делает код менее «дёрганым» по производительности, особенно на диске и в сетевых потоках.',
        },
      ],
      codeExample: {
        title: 'Reader + кодировка + буфер',
        language: 'java',
        snippet: `import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

public class ResourceRead {
    public String readAll(InputStream inputStream) throws IOException {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8))) {
            StringBuilder out = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                out.append(line).append('\\n');
            }
            return out.toString();
        }
    }
}`,
        walkthrough: [
          'InputStreamReader переводит байты в символы по UTF-8.',
          'BufferedReader читает блоками, а не по одному байту/символу.',
        ],
        commonPitfall: 'Игнорировать кодировку и использовать дефолтную (получить «кракозябры» на другой машине).',
      },
      glossary: [
        { term: 'Charset', meaning: 'Кодировка: правило преобразования байтов в символы.' },
        { term: 'Buffer', meaning: 'Промежуточная память для уменьшения числа операций ввода-вывода.' },
        { term: 'flush()', meaning: 'Принудительно отправить данные из буфера в целевой поток.' },
      ],
      estimatedMinutes: 4,
    }),

    topic({
      id: 'io-main-classes',
      title: 'I/O: основные классы и как их комбинировать',
      quickAnswer:
        'В I/O важно не запоминать «все классы», а понимать роли: источник/приёмник, декораторы (буфер, кодировка), и удобные фабрики из `Files`. Обычно строят цепочку: поток байт → декодер → буфер → чтение строк.',
      explainBrief: [
        'Байт-уровень: `InputStream`/`OutputStream` + конкретные реализации (`FileInputStream`, `ByteArrayInputStream`).',
        'Текст: `Reader`/`Writer` + мост `InputStreamReader`/`OutputStreamWriter` (задаёт Charset).',
        'Буфер: `BufferedInputStream`, `BufferedOutputStream`, `BufferedReader`, `BufferedWriter`.',
        'Декораторы можно «слоить»: каждый слой добавляет ответственность (кодировка, буферизация, формат).',
        'NIO-утилиты: `Files.newBufferedReader/newBufferedWriter/readAllLines/write` — чаще всего проще для файлов.',
        'Для форматированного вывода есть `PrintWriter`/`Formatter`, но важно не потерять ошибки (проверять `checkError`).',
      ],
      interviewFocus: [
        {
          question: 'Какая «типовая сборка» для чтения текста из InputStream?',
          expectedAnswer:
            'Обычно строят цепочку `InputStream` → `InputStreamReader(…, UTF_8)` → `BufferedReader`. Первый слой даёт байты, второй переводит байты в символы с явной кодировкой, третий ускоряет чтение и даёт удобные методы вроде `readLine()`.',
        },
        {
          question: 'Когда удобнее использовать `Files.*`, а не `FileInputStream` напрямую?',
          expectedAnswer:
            'Когда работа именно с файлами и нужен простой, читабельный код: `Files` даёт фабрики с буферизацией и кодировкой, а также высокоуровневые операции записи/чтения. Низкоуровневые стримы оставляют для случаев, где нужен контроль, потоковая обработка или интеграция с API, принимающим `InputStream`.',
        },
      ],
      codeExample: {
        title: 'Цепочка: InputStream -> Reader(UTF-8) -> BufferedReader',
        language: 'java',
        snippet: `import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

public class IoChain {
    public String readFirstLine(InputStream inputStream) throws IOException {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8))) {
            return reader.readLine();
        }
    }
}`,
        walkthrough: [
          'InputStreamReader явно задаёт UTF-8, чтобы текст был одинаковым на всех машинах.',
          'BufferedReader добавляет буфер и удобный `readLine()`.',
        ],
        commonPitfall: 'Использовать `new InputStreamReader(stream)` без кодировки и случайно зависеть от дефолта ОС.',
      },
      glossary: [
        { term: 'InputStream', meaning: 'Источник байт: из него читают данные (например, файл, сеть, ByteArray).' },
        { term: 'Reader', meaning: 'Источник символов: из него читают текст (например, строки), а не «сырые» байты.' },
        { term: 'InputStreamReader', meaning: 'Адаптер: берёт байты из InputStream и декодирует их в символы по Charset (например UTF-8).' },
        { term: 'Files', meaning: 'Утилиты NIO для безопасной работы с файлами.' },
      ],
      estimatedMinutes: 4,
    }),

    topic({
      id: 'io-rules',
      title: 'Правила работы с I/O: кодировка, закрытие, буфер и ошибки',
      quickAnswer:
        'В I/O чаще всего «стреляют» не алгоритмы, а дисциплина: всегда закрывать ресурсы, фиксировать кодировку, буферизовать, не глотать `IOException`, и помнить, что I/O — медленное и потенциально ломающееся.',
      explainBrief: [
        'Всегда закрывать ресурсы через try-with-resources; не держать поток открытым «на всякий случай».',
        'Всегда задавать Charset для текста (обычно UTF-8); не полагаться на дефолт ОС.',
        'Буферизовать чтение/запись, если есть много мелких операций.',
        'Не смешивать ответственность: метод либо читает, либо парсит, либо валидирует; иначе трудно тестировать и обрабатывать ошибки.',
        'Не глотать исключения: либо пробрасывать, либо превращать в понятную ошибку слоя с сохранением cause.',
        'Понимать границы памяти: `readAllBytes/readAllLines` удобно, но опасно для больших файлов.',
      ],
      interviewFocus: [
        {
          question: 'Какие 3–4 базовых правила ты бы назвал при работе с I/O в Java?',
          expectedAnswer:
            'Закрывать ресурсы (try-with-resources), задавать кодировку для текста (UTF-8), использовать буферизацию для производительности и не глотать `IOException`. Дополнительно — не читать «всё целиком» без оценки размера и аккуратно работать с границами ответственности (I/O отдельно, парсинг отдельно).',
        },
        {
          question: 'Почему `readAllBytes()` может быть плохой идеей?',
          expectedAnswer:
            'Он загружает всё в память, поэтому на больших файлах легко получить OutOfMemoryError и деградацию. Для больших данных лучше потоковая обработка: читать порциями и обрабатывать инкрементально.',
        },
      ],
      codeExample: {
        title: 'Потоковая обработка: читать порциями',
        language: 'java',
        snippet: `import java.io.IOException;
import java.io.InputStream;

public class StreamingRead {
    public long countBytes(InputStream inputStream) throws IOException {
        byte[] buffer = new byte[8 * 1024];
        long total = 0;
        int read;
        while ((read = inputStream.read(buffer)) != -1) {
            total += read;
        }
        return total;
    }
}`,
        walkthrough: [
          'Чтение идёт порциями, без загрузки всего файла в память.',
          'Размер буфера можно подобрать под нагрузку, но «волшебного» числа нет.',
        ],
        commonPitfall: 'Считать, что `readAllBytes()` безопасен для любых данных и объёмов.',
        productionNote:
          'Если I/O идёт по сети, дополнительно важны таймауты, ограничения размера и контроль источника данных (не доверять внешнему вводу).',
      },
      glossary: [
        { term: 'IOException', meaning: 'Базовая checked-ошибка ввода-вывода (файл, сеть, права доступа).' },
        { term: 'UTF-8', meaning: 'Распространённая кодировка, которую обычно фиксируют для текстовых данных.' },
        { term: 'Streaming', meaning: 'Потоковая обработка: читать/писать частями, без загрузки всего целиком.' },
      ],
      estimatedMinutes: 4,
    }),

    topic({
      id: 'serialization',
      title: 'Сериализация: что это и какие риски',
      simpleDefinitionOverride:
        'Сериализация — это преобразование объекта в набор байт для хранения или передачи, а десериализация — обратное восстановление объекта из байт. В Java есть встроенная сериализация через `Serializable`, но её используют осторожно: она чувствительна к изменениям классов и может быть небезопасной при работе с недоверенными данными.',
      quickAnswer:
        'Сериализация — преобразование объекта в байты для хранения/передачи. В Java есть встроенная `Serializable`, но её используют осторожно: она хрупкая к изменениям классов и может быть небезопасной.',
      explainBrief: [
        'Java-serialization (`ObjectOutputStream`) сохраняет граф объектов, но зависит от структуры классов.',
        '`serialVersionUID` помогает контролировать совместимость версий.',
        'При изменениях класса старые данные могут перестать читаться или начать читаться неверно.',
        'Сериализация может быть уязвимостью: десериализация непроверенных данных — частый источник атак.',
        'В прикладных системах чаще используют форматы JSON/Protobuf/Avro вместо Java-serialization.',
        'Нужно думать про то, какие поля сериализуются (transient) и как хранить секреты.',
      ],
      interviewFocus: [
        {
          question: 'Зачем нужен `serialVersionUID`?',
          expectedAnswer:
            'Чтобы явно контролировать совместимость при десериализации между версиями класса; иначе JVM вычисляет его автоматически и изменения ломают чтение.',
        },
        {
          question: 'Почему опасно десериализовать данные из недоверенного источника?',
          expectedAnswer:
            'Десериализация может привести к выполнению вредоносного кода через gadget chains: данные «подбирают» так, чтобы при восстановлении объектов сработали опасные методы. Поэтому сериализованные объекты нельзя принимать от внешнего мира без строгих ограничений и фильтрации классов.',
        },
      ],
      codeExample: {
        title: 'Serializable + serialVersionUID + transient',
        language: 'java',
        snippet: `import java.io.Serializable;

public class UserProfile implements Serializable {
    private static final long serialVersionUID = 1L;

    private final String username;
    private transient String accessToken;

    public UserProfile(String username, String accessToken) {
        this.username = username;
        this.accessToken = accessToken;
    }
}`,
        walkthrough: [
          '`serialVersionUID` фиксирует версию сериализации.',
          '`transient` исключает поле из сериализации (например, токен).',
        ],
        commonPitfall:
          'Сериализовать чувствительные данные (токены/пароли) или принимать Java-serialization «снаружи». Хороший тон: секреты держать `transient`/в отдельном хранилище и для интеграций использовать контрактный формат (JSON/Protobuf), а не `ObjectInputStream`.',
        productionNote:
          'Для интеграций обычно выбирают контрактный формат (JSON/Protobuf) и явные схемы. Если десериализация всё же нужна (внутренний доверенный контур), ограничивают набор допустимых классов, валидируют данные после чтения и не дают «пользователю» управлять классами в графе объектов.',
      },
      glossary: [
        { term: 'Serializable', meaning: 'Маркерный интерфейс для включения стандартной сериализации Java.' },
        { term: 'transient', meaning: 'Ключевое слово: поле не сериализуется.' },
        { term: 'serialVersionUID', meaning: 'Идентификатор версии сериализованного класса.' },
      ],
      estimatedMinutes: 4,
    }),

    topic({
      id: 'algorithms-big-o',
      title: 'Алгоритмы: Big O и виды временной сложности',
      simpleDefinitionOverride:
        'Big O — это оценка того, как растёт время или память алгоритма при увеличении размера входных данных. Она показывает порядок роста (например \(O(n)\), \(O(n^2)\)), а не «сколько миллисекунд будет работать» на конкретном компьютере.',
      quickAnswer:
        'Big O описывает рост времени/памяти при увеличении входа. Важно уметь называть типичные сложности: \(O(1)\), \(O(\log n)\), \(O(n)\), \(O(n \log n)\), \(O(n^2)\) и понимать, что «константы» и контекст всё равно важны.',
      explainBrief: [
        'Оценка Big O отражает порядок роста, а не точное время в миллисекундах.',
        'Линейный проход по массиву обычно \(O(n)\), бинарный поиск по отсортированному — \(O(\log n)\).',
        'Сортировки сравнениями имеют нижнюю границу \(O(n \log n)\).',
        'Хеш-структуры обычно дают быстрые операции, но имеют худшие случаи на неудачных данных и плохих `hashCode`.',
        'Важно различать худший и средний случаи.',
        'Оценка памяти тоже важна: например, копирование массива — \(O(n)\) по памяти.',
      ],
      interviewFocus: [
        {
          question: 'Чем отличается \(O(n)\) от \(O(n^2)\) на практике?',
          expectedAnswer:
            'При росте входа квадратичные алгоритмы быстро становятся слишком медленными; даже небольшое увеличение n резко увеличивает время.',
        },
        {
          question: 'Почему в сложностях важно уточнять «худший случай»?',
          expectedAnswer:
            'Потому что один и тот же подход может работать быстро на типичных данных и резко деградировать на неудачных входах. В инженерной практике это влияет на гарантии по времени ответа и выбор структуры данных под нагрузку.',
        },
      ],
      codeExample: {
        title: 'Два вложенных цикла: пример \(O(n^2)\)',
        language: 'java',
        snippet: `public class ComplexityExample {
    public int countPairs(int[] values) {
        int pairs = 0;
        for (int i = 0; i < values.length; i++) {
            for (int j = i + 1; j < values.length; j++) {
                if (values[i] == values[j]) {
                    pairs++;
                }
            }
        }
        return pairs;
    }
}`,
        walkthrough: [
          'Внешний цикл проходит n раз, внутренний — в среднем ~n/2 раз.',
          'Итог: порядок \(O(n^2)\).',
        ],
        commonPitfall: 'Не замечать скрытых вложенных проходов (например, `contains` внутри цикла по коллекции).',
      },
      glossary: [
        { term: 'Big O', meaning: 'Нотация для оценки порядка роста времени/памяти алгоритма.' },
        { term: 'Worst case', meaning: 'Худший случай: максимальная сложность при неудачных данных.' },
      ],
      estimatedMinutes: 4,
    }),

    topic({
      id: 'sorting-quicksort-mergesort',
      title: 'Сортировки: quicksort vs merge sort',
      simpleDefinitionOverride:
        'Сортировки почти всегда вызывают через готовые API (`Arrays.sort`, `Collections.sort`, `stream().sorted()`), но важно понимать свойства алгоритма «под капотом»: сложность \(O(n \\log n)\), стабильность и расход памяти. Это помогает не только на собесе, но и в проде — на больших объёмах и при многоуровневой сортировке.',
      quickAnswer:
        'Quicksort обычно быстрый на практике и часто сортирует «на месте», но в худшем случае может быть \(O(n^2)\). Merge sort стабилен, гарантирует \(O(n \log n)\), но требует дополнительной памяти \(O(n)\).',
      explainBrief: [
        'Quicksort: разделение по pivot и рекурсия; средняя сложность \(O(n \log n)\).',
        'Худший случай quicksort — плохой выбор pivot (например, уже отсортированный массив без рандомизации).',
        'Merge sort: деление пополам + слияние; всегда \(O(n \log n)\) по времени.',
        'Merge sort стабилен (сохраняет порядок равных элементов), quicksort обычно нет.',
        'Merge sort требует буфер, quicksort может работать in-place (зависит от реализации).',
        'В реальной Java-разработке сортируют через `Arrays.sort`, `Collections.sort` или `stream().sorted(Comparator)` — руками quick/merge почти никто не пишет.',
        'Под капотом Java обычно использует разные реализации: для объектов — стабильный TimSort, для примитивов — Dual-Pivot Quicksort (Java 11).',
        'Зачем это знать: сортировка почти всегда \(O(n \\log n)\), и на больших списках это быстро становится узким местом по времени/памяти.',
        'Стабильность критична для многоуровневой сортировки: «сначала по вторичному полю, потом по первичному» работает корректно только при stable сортировке.',
      ],
      interviewFocus: [
        {
          question: 'Какая сортировка стабильная и зачем это нужно?',
          expectedAnswer:
            'Merge sort стабильная. Стабильность важна при многоуровневых сортировках (сначала по вторичному полю, потом по первичному).',
        },
        {
          question: 'Почему quicksort может стать \(O(n^2)\)?',
          expectedAnswer:
            'Если pivot систематически выбирается неудачно, разбиения получаются сильно несбалансированными.',
        },
        {
          question: 'Какую сортировку обычно используешь в проде и почему?',
          expectedAnswer:
            'Чаще всего — готовые API: `stream().sorted(...)`, `Collections.sort(...)`, `Arrays.sort(...)`. Это проще и безопаснее: внутри оптимизированные реализации. Важно понимать свойства: сложность порядка \(O(n \\log n)\), стабильность для объектов (TimSort) и потенциальные проблемы на больших объёмах данных.',
        },
        {
          question: 'Когда свойства сортировки реально важны, а когда можно не думать?',
          expectedAnswer:
            'На маленьких списках разницы почти нет. Важно на больших объёмах (миллионы элементов), в latency-чувствительных местах (API), при многоуровневой сортировке (нужна стабильность) и когда важен расход памяти (merge-подход использует буфер).',
        },
      ],
      codeExample: {
        title: 'Идея merge: «слить два отсортированных массива»',
        language: 'java',
        snippet: `public class MergeIdea {
    public int[] mergeSorted(int[] left, int[] right) {
        int[] out = new int[left.length + right.length];
        int i = 0;
        int j = 0;
        int k = 0;
        while (i < left.length && j < right.length) {
            out[k++] = (left[i] <= right[j]) ? left[i++] : right[j++];
        }
        while (i < left.length) {
            out[k++] = left[i++];
        }
        while (j < right.length) {
            out[k++] = right[j++];
        }
        return out;
    }
}`,
        walkthrough: [
          'Слияние — ключевая операция merge sort: линейно объединяет два отсортированных массива.',
          'Время слияния: \(O(n)\) для суммарного размера.',
        ],
        commonPitfall:
          'Выбирать сортировку «по слухам» как “самую быструю” и игнорировать требования. Хороший тон: сначала понять, важна ли стабильность, какой допустим расход памяти, и нужен ли гарантированный худший случай — и уже под это выбирать алгоритм/реализацию.',
        productionNote:
          'Шпаргалка выбора: нужна стабильность или многоуровневая сортировка — ориентируются на stable (часто merge-подход). Важно in-place и минимум памяти — чаще quick-подход. Нужна гарантия \(O(n \\log n)\) в худшем случае — quick без защит (рандомизация/интроспекция) рискован. В Java на практике чаще выбирают не “алгоритм”, а правильный API (`Arrays.sort`, `Collections.sort`) и понимают его свойства для примитивов/объектов.',
      },
      glossary: [
        {
          term: 'Quicksort',
          meaning:
            'Сортировка «разделяй и властвуй»: выбирают опорный элемент (pivot), делят массив на «меньше/больше pivot» и рекурсивно сортируют части. В среднем \(O(n \\log n)\), в худшем случае \(O(n^2)\).',
        },
        {
          term: 'Merge sort',
          meaning:
            'Сортировка «разделяй и властвуй»: делят массив пополам, сортируют части и сливают (merge). Всегда \(O(n \\log n)\), обычно требует дополнительную память \(O(n)\), зато стабильно сохраняет порядок равных элементов.',
        },
        {
          term: 'TimSort',
          meaning:
            'Стабильная сортировка для объектов: в Java 11 её используют `Arrays.sort(T[])`, `Collections.sort(List<T>)` и `List.sort(Comparator)` (для объектных типов). Хорошо работает на частично отсортированных данных.',
        },
        {
          term: 'Dual-Pivot Quicksort',
          meaning:
            'Quicksort-вариант для примитивных массивов: в Java 11 его используют `Arrays.sort(int[])`, `Arrays.sort(long[])` и т.п. Использует два pivot и обычно даёт хорошую производительность на практике.',
        },
        { term: 'Pivot', meaning: 'Опорный элемент, относительно которого делят массив в quicksort.' },
        { term: 'Stability (stable sort)', meaning: 'Стабильность: равные элементы сохраняют исходный порядок после сортировки.' },
      ],
      estimatedMinutes: 4,
    }),

    topic({
      id: 'generics-basics',
      title: 'Generics: типобезопасность и зачем они нужны',
      simpleDefinitionOverride:
        'Generics — это способ описывать контейнеры и методы с типами параметров так, чтобы компилятор проверял типы заранее. Самая важная практическая идея: `List<Integer>` не является `List<Number>`, потому что список можно изменять; `? extends` и `? super` нужны, чтобы писать универсальные и при этом типобезопасные методы.',
      quickAnswer:
        'Generics позволяют писать обобщённый код без потери типобезопасности: `List<String>` гарантирует, что внутри строки, и убирает необходимость в приведениях типов.',
      explainBrief: [
        'До generics (Java 5) коллекции использовали raw types: писали просто `List`, а методы принимали/возвращали `Object`.',
        'Из-за этого тип проверяли вручную приведениями, и ошибки всплывали в рантайме как `ClassCastException`.',
        'Generics дают проверку на этапе компиляции и более понятные контракты API.',
        'Ключевой факт: `List<Integer>` ≠ `List<Number>`. Причина простая: список — изменяемый контейнер, и иначе в `List<Integer>` можно было бы положить `Double`.',
        'Аналогия с коробками: коробка яблок — не то же самое, что коробка фруктов, иначе в коробку яблок можно положить банан.',
        'Типовые параметры работают по механизму type erasure: в байткоде generics стираются.',
        'Нельзя создать `new T()` или `new List<String>[10]` из-за стирания типов (с ограничениями).',
        'Wildcard `?` нужен для гибкости API, когда точный параметр типа не важен.',
        'Практическое правило: `? extends T` — безопасно читать как `T`, но нельзя добавлять элементы; `? super T` — безопасно добавлять `T`, но читать можно только как `Object`.',
        'Мини-таблица: `List<T>` — можно читать и писать; `List<? extends T>` — читать можно, писать нельзя; `List<? super T>` — писать можно, читать как `Object`.',
        'Упрощение без теории: `?` означает «точный тип неизвестен», а PECS — это мнемоника выбора wildcard: Producer (читаю) → `extends`, Consumer (пишу) → `super`.',
      ],
      extraKeyPoints: [
        'Почти весь коммерческий код живёт с конкретными типами (`List<User>`). Wildcard нужен в основном авторам API и утилитам (например, copy/collect).',
      ],
      interviewFocus: [
        {
          question: 'Что такое type erasure и к чему он приводит?',
          expectedAnswer:
            'В рантайме параметры типов стираются: JVM не хранит `List<String>` как отдельный «класс списка строк». Это даёт ограничения: нельзя `new T()`, нельзя нормально создать массив параметризованных типов, и часть проверок переносится на компиляцию.',
        },
        {
          question: 'Зачем нужны `? extends T` и `? super T`?',
          expectedAnswer:
            'Потому что `List<Integer>` нельзя использовать как `List<Number>`, а универсальные методы всё равно нужны. `? extends T` подходит, когда список является источником (чтение); `? super T` — когда список является приёмником (запись). Так метод остаётся типобезопасным.',
        },
        {
          question: 'Почему нельзя добавить элемент в `List<? extends Number>`?',
          expectedAnswer:
            'Потому что это может быть `List<Integer>`, `List<Double>` или `List<BigDecimal>`. Компилятор не знает точный тип списка и не может гарантировать, что добавляемое значение подходит, поэтому запрещает добавление.',
        },
      ],
      codeExample: {
        title: 'PECS на примере copy',
        language: 'java',
        snippet: `import java.util.List;

public class GenericsCopy {
    public static <T> void copy(List<? extends T> from, List<? super T> to) {
        for (T item : from) {
            to.add(item);
        }
    }
}`,
        walkthrough: [
          '`from` производит элементы: можно читать как T, поэтому `? extends T`.',
          '`to` потребляет элементы: можно добавлять T, поэтому `? super T`.',
        ],
        commonPitfall: 'Путать `extends` и `super`, из-за чего метод становится слишком строгим или небезопасным.',
      },
      glossary: [
        {
          term: 'Invariance',
          meaning:
            'Инвариантность generics: `List<A>` не является подтипом `List<B>`, даже если `A` является подтипом `B` (пример: `List<Integer>` не является `List<Number>`).',
        },
        {
          term: 'Number',
          meaning: 'Базовый класс для чисел в Java. Его наследники: `Integer`, `Long`, `Double`, `BigDecimal` и др.',
        },
        { term: 'Type erasure', meaning: 'Стирание параметров типов generics в рантайме.' },
        {
          term: 'Wildcard',
          meaning:
            'Подстановочный тип `?`: «точный параметр типа не важен/неизвестен». `List<?>` принимает любой список, но тогда нельзя безопасно `add`, а `get` даёт минимум `Object`.',
        },
        {
          term: 'PECS',
          meaning:
            'Мнемоника выбора wildcard: Producer Extends (если «читают» из коллекции) и Consumer Super (если «пишут» в коллекцию). Проще: читаю → `extends`, пишу → `super`.',
        },
      ],
      estimatedMinutes: 4,
    }),

    topic({
      id: 'collections-hierarchy',
      title: 'Коллекции: иерархия Collection и Map',
      simpleDefinitionOverride:
        'Коллекции в Java делятся на две большие ветки: `Collection` (наборы элементов) и `Map` (пары ключ→значение). Правильный выбор структуры зависит от того, нужен ли порядок, уникальность и быстрый доступ по ключу.',
      quickAnswer:
        'Есть два семейства структур: `Collection` (List/Set/Queue) — когда важны элементы как набор, и `Map` — когда нужен быстрый доступ по ключу. Дальше выбор упирается в требования: порядок, уникальность, и стоимость операций.',
      explainBrief: [
        'Базовый интерфейс `Collection` разделяется на `List`, `Set`, `Queue`.',
        '`List` хранит элементы по порядку и допускает дубли.',
        '`Set` хранит уникальные элементы (по `equals/hashCode` или компаратору).',
        '`Queue` описывает очереди и структуры вроде deque/priority queue.',
        '`Map` не наследует `Collection` и работает с парами ключ/значение.',
        'Выбор коллекции — компромисс между удобством, сложностью операций и потреблением памяти.',
      ],
      interviewFocus: [
        {
          question: 'Почему `Map` не наследует `Collection`?',
          expectedAnswer:
            'Потому что семантика другая: хранит пары ключ→значение и операции доступа строятся вокруг ключа, а не «просто набор элементов».',
        },
        {
          question: 'От чего зависит уникальность элементов в Set?',
          expectedAnswer:
            'В hash-наборах (HashSet/LinkedHashSet) уникальность определяется `equals/hashCode`. В сортированных наборах (TreeSet) — результатом сравнения (`Comparator`/`Comparable`): если `compare` возвращает 0, элементы считаются одинаковыми.',
        },
      ],
      codeExample: {
        title: 'Set уникален только при корректном equals/hashCode',
        language: 'java',
        snippet: `import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

public class SetUniq {
    public static void main(String[] args) {
        Set<User> users = new HashSet<>();
        users.add(new User("a"));
        users.add(new User("a"));
        System.out.println(users.size()); // 1
    }
}

class User {
    private final String id;
    User(String id) { this.id = id; }
    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User)) return false;
        User user = (User) o;
        return Objects.equals(id, user.id);
    }
    @Override public int hashCode() { return Objects.hash(id); }
}`,
        walkthrough: [
          'HashSet использует hashCode/equals, чтобы определять «одинаковость».',
          'Без корректных методов возможны дубликаты и «потеря» элементов.',
        ],
        commonPitfall: 'Использовать mutable поля в equals/hashCode и менять их после добавления в HashSet/HashMap.',
      },
      glossary: [
        { term: 'Collection', meaning: 'Базовый интерфейс для коллекций элементов (кроме Map).' },
        { term: 'Map', meaning: 'Отображение ключ→значение, отдельная ветка иерархии.' },
      ],
      estimatedMinutes: 4,
    }),

    topic({
      id: 'list-arraylist-linkedlist',
      title: 'List: ArrayList vs LinkedList и их сложности',
      simpleDefinitionOverride:
        '`ArrayList` и `LinkedList` — две разные реализации `List`. `ArrayList` хранит элементы подряд в массиве и хорошо подходит для чтения/итерации. `LinkedList` хранит узлы со ссылками и выигрывает только в редких сценариях вставки/удаления при наличии позиции (итератора), но часто проигрывает по скорости из-за слабой локальности данных.',
      quickAnswer:
        'ArrayList хорош для доступа по индексу и итерации, но вставки в середину дорогие из-за сдвига. LinkedList даёт дешёвые вставки/удаления по ссылке, но доступ по индексу дорогой.',
      explainBrief: [
        'ArrayList хранит элементы в массиве: `get(i)` обычно \(O(1)\).',
        'Добавление в конец обычно быстро, но при расширении внутреннего массива требует копирования элементов.',
        'Вставка/удаление в середине ArrayList — \(O(n)\) из-за сдвига хвоста.',
        'LinkedList хранит узлы: `get(i)` — \(O(n)\), потому что нужно пройти список.',
        'LinkedList полезен, если есть много операций вставки/удаления через итератор в середине (и есть ссылка на узел).',
        'На практике LinkedList часто проигрывает из-за кэшей CPU и накладных расходов на узлы.',
      ],
      interviewFocus: [
        {
          question: 'Почему `ArrayList.add` «почти всегда» \(O(1)\), но иногда \(O(n)\)?',
          expectedAnswer:
            'Пока есть свободное место во внутреннем массиве, добавление — это просто запись элемента. Когда места не хватает, `ArrayList` расширяет массив и копирует элементы, поэтому конкретная операция может быть \(O(n)\).',
        },
        {
          question: 'Почему LinkedList часто медленнее, чем кажется по теории?',
          expectedAnswer:
            'Из-за большого числа объектов, плохой локальности данных и дополнительных разыменований ссылок (cache misses).',
        },
      ],
      codeExample: {
        title: 'Добавление в ArrayList и расширение массива',
        language: 'java',
        snippet: `import java.util.ArrayList;
import java.util.List;

public class ListGrowth {
    public List<Integer> build(int n) {
        List<Integer> out = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            out.add(i);
        }
        return out;
    }
}`,
        walkthrough: [
          'В большинстве итераций `add` просто кладёт элемент в массив.',
          'Иногда происходит расширение и копирование — редкая, но дорогая операция.',
        ],
        commonPitfall:
          'Делать много вставок в начало `ArrayList` и удивляться деградации. Как лучше: если нужен «добавлять в начало/конец» — использовать `Deque` (обычно `ArrayDeque`); если нужно просто получить обратный порядок — добавлять в конец и один раз развернуть; если часто вставляют в середину — сначала подумать, точно ли нужен список, или лучше другая структура/подход.',
        productionNote:
          'В проде чаще всего побеждает простота: `ArrayList` для чтения/итерации и `ArrayDeque` для очередей/стека. `LinkedList` обычно берут только если реально есть сценарий вставок/удалений через итератор и это измеримо важно.',
      },
      glossary: [
        {
          term: 'Locality',
          meaning:
            'Локальность данных: когда элементы лежат подряд в памяти (как в массиве), CPU кэш читает их быстрее. Это одна из причин, почему в Java `ArrayList` часто быстрее `LinkedList` на итерации/поиске, даже если по теории у `LinkedList` «дешёвые вставки».',
        },
      ],
      estimatedMinutes: 4,
    }),

    topic({
      id: 'set-hashset-linkedhashset-treeset',
      title: 'Set: HashSet, LinkedHashSet, TreeSet',
      simpleDefinitionOverride:
        '`Set` — коллекция без дубликатов. `HashSet` даёт быстрые операции без гарантии порядка, `LinkedHashSet` сохраняет порядок вставки, `TreeSet` хранит элементы отсортированными и определяет «уникальность» через сравнение (`Comparator`/`Comparable`).',
      quickAnswer:
        'HashSet даёт быстрые операции \(O(1)\) в среднем. LinkedHashSet сохраняет порядок вставки. TreeSet хранит элементы отсортированными и даёт \(O(\log n)\) на операции.',
      explainBrief: [
        'HashSet основан на хеш-таблице: порядок элементов не гарантируется.',
        'LinkedHashSet добавляет двусвязный список для сохранения порядка вставки.',
        'TreeSet основан на дереве поиска: элементы упорядочены по `Comparator`/`Comparable`.',
        'TreeSet считает элементы одинаковыми, если `compare(a, b) == 0`: второй элемент тогда не добавится, даже если `equals` у объектов говорит иначе.',
        'Выбор зависит от требований: нужен ли порядок, и какой именно (вставки vs сортировки).',
        '«Плохой hashCode» — когда много разных объектов дают один и тот же hash (например, константа): тогда HashSet/HashMap деградируют из быстрого доступа к долгим поискам из-за коллизий.',
      ],
      interviewFocus: [
        {
          question: 'Как LinkedHashSet сохраняет порядок?',
          expectedAnswer:
            'Он хранит дополнительную связность между элементами (список), чтобы возвращать итерацию в порядке вставки.',
        },
        {
          question: 'Почему TreeSet может «съесть» элемент, если Comparator некорректен?',
          expectedAnswer:
            'Если Comparator считает разные элементы равными (compare==0), множество воспринимает их как один элемент и не добавляет второй.',
        },
      ],
      codeExample: {
        title: 'TreeSet определяет уникальность через Comparator',
        language: 'java',
        snippet: `import java.util.Comparator;
import java.util.Set;
import java.util.TreeSet;

public class TreeSetDemo {
    public static void main(String[] args) {
        Comparator<String> byLength = (a, b) -> Integer.compare(a.length(), b.length());
        Set<String> set = new TreeSet<>(byLength);
        set.add("aa");
        set.add("bb");
        System.out.println(set.size()); // 1: compare==0 -> считается «одинаково»
    }
}`,
        walkthrough: [
          'Comparator сравнивает только длину, поэтому "aa" и "bb" равны для TreeSet.',
          'TreeSet хранит «уникальность» по результату сравнения, а не по equals/hashCode.',
        ],
        commonPitfall:
          'Писать `Comparator`, который не отражает ожидаемую уникальность. Как лучше: сравнение должно различать элементы так, как вы ожидаете их «уникальность» в TreeSet/TreeMap (и желательно быть согласованным с `equals`: если `equals` true, то `compare` должен вернуть 0).',
        productionNote:
          'Практика: если нужен просто уникальный набор — берут `HashSet`. Если нужен предсказуемый порядок вставки — `LinkedHashSet`. Если нужны сортировка и диапазоны — `TreeSet`, но тогда внимательно относятся к `Comparator` и к тому, что именно считается «одинаковым».',
      },
      glossary: [
        { term: 'LinkedHashSet', meaning: 'HashSet с сохранением порядка вставки.' },
        { term: 'TreeSet', meaning: 'Отсортированное множество на дереве поиска.' },
      ],
      estimatedMinutes: 4,
    }),

    topic({
      id: 'map-hashmap-basics',
      title: 'Map: HashMap и базовые операции',
      simpleDefinitionOverride:
        '`HashMap` — это структура данных для хранения пар ключ→значение с быстрым доступом по ключу. Корректность и скорость зависят от ключей: они должны иметь стабильные `equals/hashCode` и не менять поля, участвующие в этих методах, после добавления в map.',
      quickAnswer:
        'HashMap хранит пары ключ→значение и даёт быстрый доступ по ключу. Корректность зависит от `equals/hashCode` ключа: неизменяемость ключа критична.',
      explainBrief: [
        'Операции `get/put/containsKey/remove` в среднем \(O(1)\).',
        'Ключи сравниваются через `hashCode` и `equals`.',
        'Если ключ изменился после `put`, запись может стать «недоступной» по ключу.',
        'Наличие `null` ключа/значения допускается (в HashMap), но это часто ухудшает читаемость API.',
        'При коллизиях элементы попадают в одну корзину; реализация пытается снижать деградацию.',
        'HashMap не гарантирует порядок обхода.',
      ],
      interviewFocus: [
        {
          question: 'Что будет, если изменить поле ключа, участвующее в hashCode, после добавления в HashMap?',
          expectedAnswer:
            'Элемент останется физически в другой «корзине» и по изменённому ключу его нельзя будет найти; возможны «потери» и дубликаты.',
        },
        {
          question: 'Почему важно, чтобы equals/hashCode были согласованы?',
          expectedAnswer:
            'Если equals true, hashCode должен совпадать, иначе HashMap/HashSet работают некорректно.',
        },
      ],
      codeExample: {
        title: 'Проблема изменяемого ключа',
        language: 'java',
        snippet: `import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

public class MutableKey {
    public static void main(String[] args) {
        UserKey key = new UserKey("a");
        Map<UserKey, String> map = new HashMap<>();
        map.put(key, "value");

        key.id = "b"; // ключ изменён
        System.out.println(map.get(key)); // null
    }
}

class UserKey {
    String id;
    UserKey(String id) { this.id = id; }
    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserKey)) return false;
        UserKey userKey = (UserKey) o;
        return Objects.equals(id, userKey.id);
    }
    @Override public int hashCode() { return Objects.hash(id); }
}`,
        walkthrough: [
          'После `put` ключ должен быть логически неизменяемым (особенно поля hashCode/equals).',
          'Иначе `get` вычислит другой hash и не найдёт корзину.',
        ],
        commonPitfall: 'Использовать в качестве ключа mutable объект без строгих гарантий неизменяемости.',
      },
      glossary: [
        { term: 'HashMap', meaning: 'Хеш-таблица ключ→значение без гарантии порядка.' },
        {
          term: 'Коллизия',
          meaning:
            'Ситуация, когда разные ключи дают одинаковый `hashCode` и попадают в одну корзину (bucket). Тогда HashMap дополнительно сравнивает ключи через `equals`, чтобы найти нужную запись.',
        },
      ],
      estimatedMinutes: 4,
    }),

    topic({
      id: 'map-linkedhashmap-treemap',
      title: 'LinkedHashMap и TreeMap: порядок вставки и сортировка ключей',
      simpleDefinitionOverride:
        '`LinkedHashMap` — это `HashMap` с предсказуемым порядком обхода (обычно порядок вставки или порядок доступа). Его часто используют для небольших in-memory кэшей и ситуаций, где важна стабильная выдача. `TreeMap` — это map с отсортированными ключами, полезна для диапазонов и упорядоченного обхода.',
      quickAnswer:
        'LinkedHashMap сохраняет порядок (вставки или доступа), TreeMap сортирует по ключу. Выбор зависит от того, нужен ли предсказуемый порядок и какие операции критичны по времени.',
      explainBrief: [
        'LinkedHashMap итерацию возвращает в порядке вставки (или доступа, если включить accessOrder).',
        'В проде LinkedHashMap часто берут для LRU-подобных кэшей: «вытеснить самый давно неиспользованный» через `accessOrder=true` + `removeEldestEntry`.',
        'Плюсы LinkedHashMap: предсказуемый порядок, простой LRU, удобно для “последних N элементов” и отладки.',
        'Минусы LinkedHashMap: чуть больше памяти (доп. связи) и обычно чуть медленнее `HashMap` на тех же операциях.',
        'Пример из кода: маленький кэш «последние N результатов» (например, нормализация строк/парсинг) — кладём в map по ключу запроса и вытесняем старое.',
        'Ещё пример: нужно сохранить порядок параметров/полей при сборке ответа или при логировании (чтобы вывод был стабильным) — используют LinkedHashMap вместо HashMap.',
        'TreeMap основан на сбалансированном дереве: операции \(O(\log n)\).',
        'TreeMap требует `Comparator` или `Comparable` у ключей.',
        'TreeMap удобен для диапазонных запросов (`subMap`, `headMap`, `tailMap`).',
        'LinkedHashMap полезен для LRU-кэша (удаление самого «старого»).',
        'HashMap быстрее по среднему доступу, но без упорядочивания.',
      ],
      interviewFocus: [
        {
          question: 'Как сделать LRU-кэш на базе LinkedHashMap?',
          expectedAnswer:
            'Использовать `LinkedHashMap` с accessOrder=true и переопределить `removeEldestEntry` для ограничения размера.',
        },
        {
          question: 'Где в реальном коде встречается LinkedHashMap?',
          expectedAnswer:
            'Чаще всего — в небольших in-memory кэшах (LRU/«последние N») и там, где нужен стабильный порядок обхода (например, стабильно печатать поля/параметры в логах или собирать предсказуемый JSON-ответ). Если порядок не важен — обычно берут HashMap.',
        },
        {
          question: 'Когда TreeMap предпочтительнее HashMap?',
          expectedAnswer:
            'Когда нужна сортировка ключей или операции по диапазонам (например, взять все ключи между A и B).',
        },
      ],
      codeExample: {
        title: 'Мини-LRU на LinkedHashMap',
        language: 'java',
        snippet: `import java.util.LinkedHashMap;
import java.util.Map;

public class LruCache<K, V> extends LinkedHashMap<K, V> {
    private final int maxSize;

    public LruCache(int maxSize) {
        super(16, 0.75f, true);
        this.maxSize = maxSize;
    }

    @Override
    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
        return size() > maxSize;
    }
}`,
        walkthrough: [
          'accessOrder=true означает «порядок по доступу», а не по вставке.',
          '`removeEldestEntry` удаляет самый старый элемент при превышении размера.',
        ],
        commonPitfall: 'Использовать LinkedHashMap как «сортированный», хотя он сохраняет только порядок вставки/доступа, но не сортирует.',
        productionNote:
          'Такой кэш используют для небольших объёмов и простых сценариев: «последние N запросов», «последние N результатов вычисления». Для серьёзных кэшей (TTL, размер в байтах, метрики, конкуренция) обычно берут готовые решения.',
      },
      glossary: [
        { term: 'LinkedHashMap', meaning: 'Map с предсказуемым порядком итерации (вставки/доступа).' },
        { term: 'TreeMap', meaning: 'Отсортированная Map на дереве поиска с \(O(\log n)\) операциями.' },
        { term: 'LRU', meaning: 'Least Recently Used — стратегия вытеснения по «самому давно использованному».' },
      ],
      estimatedMinutes: 4,
    }),

    topic({
      id: 'immutable-collections',
      title: 'Неизменяемые коллекции: List.of() и Collections.unmodifiableXxx()',
      quickAnswer:
        'Неизменяемые коллекции защищают от случайных модификаций: `List.of()` создаёт действительно immutable коллекцию, а `Collections.unmodifiableList()` — «обёртку», которая запрещает изменения через этот интерфейс, но не делает исходный список неизменяемым.',
      explainBrief: [
        'Immutable коллекции удобны для констант и безопасной передачи данных между слоями.',
        '`List.of(...)` возвращает коллекцию, которую нельзя изменять: `add/remove` бросают `UnsupportedOperationException`.',
        '`Collections.unmodifiableList(list)` — это view: если исходный список изменится, view тоже «увидит» изменения.',
        'Для настоящей неизменяемости часто делают копию: `List.copyOf(list)`.',
        'Immutable снижает вероятность багов в многопоточных сценариях и упрощает reasoning.',
        'Важно отличать «неизменяемость интерфейса» от «неизменяемости данных».',
      ],
      interviewFocus: [
        {
          question: 'Чем отличается `List.of()` от `Collections.unmodifiableList()`?',
          expectedAnswer:
            '`List.of()` создаёт неизменяемую коллекцию, а `unmodifiableList` — обёртку над существующим списком; исходный список может измениться отдельно.',
        },
        {
          question: 'Как получить «настоящую» неизменяемую копию списка?',
          expectedAnswer: 'Использовать `List.copyOf(list)` (или создать новый список и обернуть).',
        },
      ],
      codeExample: {
        title: 'View vs copy: unmodifiableList и copyOf',
        language: 'java',
        snippet: `import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class ImmutabilityDemo {
    public static void main(String[] args) {
        List<String> src = new ArrayList<>();
        src.add("a");

        List<String> view = Collections.unmodifiableList(src);
        List<String> copy = List.copyOf(src);

        src.add("b");
        System.out.println(view.size()); // 2: view видит изменения
        System.out.println(copy.size()); // 1: copy независима
    }
}`,
        walkthrough: [
          'unmodifiableList — это «окно» в исходный список.',
          'copyOf создаёт независимую неизменяемую копию.',
        ],
        commonPitfall: 'Считать `unmodifiableList` полной защитой, хотя исходная коллекция всё ещё изменяема.',
      },
      glossary: [
        { term: 'Immutable', meaning: 'Неизменяемый объект/коллекция: после создания не меняет состояние.' },
        { term: 'View', meaning: 'Представление (обёртка) над данными, которая может отражать изменения источника.' },
      ],
      estimatedMinutes: 4,
    }),

    topic({
      id: 'comparable-comparator',
      title: 'Comparable и Comparator: как задаётся порядок',
      simpleDefinitionOverride:
        '`Comparable` и `Comparator` — это два способа сказать Java, «как сравнивать два объекта». `Comparable` встраивает “естественный” порядок в сам класс (через `compareTo`). `Comparator` задаёт порядок снаружи (например, “по дате”, “по имени”, “по убыванию”), не меняя класс. Это важно для сортировки и для структур вроде `TreeSet`/`TreeMap`, где сравнение определяет и порядок, и уникальность.',
      quickAnswer:
        '`Comparable` задаёт естественный порядок внутри класса (`compareTo`), а `Comparator` — внешний способ сравнения. Важно писать сравнения согласованно и не ломать контракт (транзитивность).',
      explainBrief: [
        '`Comparable<T>` реализуют, когда у класса есть естественная сортировка (например, по id).',
        '`Comparator<T>` передают в сортировку, когда нужно альтернативное правило (по дате, по имени).',
        'Если сравнение считает элементы равными (compare==0), TreeSet/TreeMap считают их одним ключом.',
        '`thenComparing` — это “если первое поле равно, сравни по второму”: например, сортировать сначала по score, а при равном score — по name.',
      ],
      interviewFocus: [
        {
          question: 'Когда выбирать Comparable, а когда Comparator?',
          expectedAnswer:
            'Comparable — если порядок «естественный» и общий для сущности; Comparator — для конкретной задачи сортировки, без изменения класса.',
        },
      ],
      codeExample: {
        title: 'thenComparing: многоуровневая сортировка',
        language: 'java',
        snippet: `import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

public class ComparatorDemo {
    public List<User> sort(List<User> users) {
        Comparator<User> byScoreDesc = (a, b) -> Integer.compare(b.score, a.score);
        Comparator<User> byNameAsc = (a, b) -> a.name.compareToIgnoreCase(b.name);
        return users.stream()
            .sorted(byScoreDesc.thenComparing(byNameAsc))
            .collect(Collectors.toList());
    }
}

class User {
    final String name;
    final int score;
    User(String name, int score) { this.name = name; this.score = score; }
}`,
        walkthrough: [
          'Сначала сортировка по score по убыванию.',
          'Для равных score — сортировка по имени.',
        ],
        commonPitfall:
          'Написать `Comparator`, который возвращает 0 для разных объектов. Как правильно: `compare(a, b) == 0` должно означать «эти элементы считаются одинаковыми в вашей задаче» (в `TreeSet/TreeMap` тогда второй элемент не добавится).',
      },
      glossary: [
        { term: 'Comparable', meaning: 'Интерфейс для «естественного» порядка внутри класса.' },
        { term: 'Comparator', meaning: 'Внешнее правило сравнения объектов.' },
      ],
      estimatedMinutes: 4,
    }),

    topic({
      id: 'lambdas-functional-interfaces',
      title: 'Лямбда-выражения и функциональные интерфейсы',
      quickAnswer:
        'Лямбда — короткая запись реализации функционального интерфейса (интерфейса с одним абстрактным методом). Она улучшает читаемость и позволяет писать декларативный код со Stream API.',
      explainBrief: [
        'Лямбда — короткая реализация функционального интерфейса.',
        'Функциональный интерфейс: один абстрактный метод.',
        'Функциональный интерфейс помечают `@FunctionalInterface` (не обязательно, но полезно).',
        'База: `Predicate`, `Function`, `Consumer`, `Supplier`.',
        '`Predicate<T>`: принимает `T`, возвращает `boolean`; нужен для условий/фильтрации (`filter`).',
        '`Function<T, R>`: принимает `T`, возвращает `R`; нужен для преобразования данных (`map`).',
        '`Consumer<T>`: принимает `T`, ничего не возвращает; нужен для действия/побочного эффекта (`forEach`).',
        '`Supplier<T>`: ничего не принимает, возвращает `T`; нужен как источник/генератор значений.',
        'Лямбда может захватывать effectively-final переменные из внешней области видимости: переменная после инициализации не должна меняться.',
        'Method reference (`Class::method`) — синтаксический сахар для лямбды.',
        'Важно понимать, что лямбда — это объект, и чрезмерное использование может влиять на аллокации (в зависимости от контекста).',
        'Читаемость важнее «умности»: сложные лямбды лучше вынести в именованные методы.',
      ],
      interviewFocus: [
        {
          question: 'Что такое функциональный интерфейс?',
          expectedAnswer:
            'Функциональный интерфейс — это интерфейс с ровно одним абстрактным методом. Его можно реализовать лямбдой или method reference. Например, `Predicate<T>` — это «условие», `Function<T,R>` — «преобразование», `Consumer<T>` — «действие без результата».',
        },
        {
          question: 'Что значит «effectively final» для захвата переменной в лямбде?',
          expectedAnswer:
            'Переменная не должна изменяться после инициализации; иначе компилятор не позволит захват в лямбду.',
        },
      ],
      codeExample: {
        title: 'Predicate + method reference',
        language: 'java',
        snippet: `import java.util.List;
import java.util.function.Predicate;
import java.util.stream.Collectors;

public class LambdaDemo {
    public List<String> filterNonBlank(List<String> values) {
        Predicate<String> nonBlank = s -> s != null && !s.trim().isEmpty();
        return values.stream()
            .filter(nonBlank)
            .collect(Collectors.toList());
    }
}

@FunctionalInterface
interface SimplePredicate<T> {
    boolean test(T value);
}`,
        walkthrough: [
          '`Predicate<String> nonBlank` — это переменная-условие для строки: возвращает `true/false`.',
          'Лямбда `s -> s != null && ...` — это реализация метода `Predicate.test(s)` (т.е. “как именно проверять строку”).',
          '`@FunctionalInterface` означает: у интерфейса ровно один абстрактный метод (здесь `test`), поэтому его можно реализовать лямбдой.',
          '`.filter(nonBlank)` применяет это условие к каждому элементу и оставляет только те, где `test` вернул true.',
        ],
        commonPitfall: 'Делать лямбду слишком сложной, смешивая много условий и побочных эффектов.',
      },
      glossary: [
        {
          term: 'Лямбда',
          meaning: 'Короткая реализация функционального интерфейса.',
        },
        {
          term: 'Функциональный интерфейс',
          meaning: 'Интерфейс с одним абстрактным методом.',
        },
        {
          term: '@FunctionalInterface',
          meaning:
            'Аннотация, подтверждающая, что интерфейс функциональный (у него ровно один абстрактный метод, поэтому его можно реализовать лямбдой или ссылкой на метод).',
        },
        {
          term: 'Predicate',
          meaning:
            'Функция-условие: принимает объект и возвращает `true/false`. Пример: `s -> s != null` или `n -> n > 0`.',
        },
        {
          term: 'Function',
          meaning:
            'Функция-преобразование: принимает значение одного типа и возвращает значение другого типа. В stream чаще всего используется в `map`.',
        },
        {
          term: 'Consumer',
          meaning:
            'Функция-действие без возвращаемого результата. Используется, когда нужно “что-то сделать” с элементом (например, `forEach`).',
        },
        {
          term: 'Supplier',
          meaning:
            'Функция-источник: ничего не принимает и возвращает значение. Используется для генерации/поставки данных.',
        },
        {
          term: 'effectively final',
          meaning:
            'Локальная переменная, которая после инициализации не изменяется. Только такие переменные можно захватывать в лямбде.',
        },
      ],
      estimatedMinutes: 4,
    }),

    topic({
      id: 'stream-api-basics',
      title: 'Stream API: map/filter/reduce и типичные ошибки',
      quickAnswer:
        'Stream API помогает обрабатывать коллекции как конвейер операций: `filter`, `map`, `sorted`, `collect`. Важно помнить, что stream ленивый и выполняется только при терминальной операции, а также избегать побочных эффектов.',
      explainBrief: [
        'Stream опирается на функциональные интерфейсы: `Predicate` (filter), `Function` (map), `Consumer` (forEach), `Supplier` (источник значений).',
        'Промежуточные операции (`map`, `filter`) ленивые и возвращают новый stream.',
        'Терминальные операции (`collect`, `count`, `forEach`) запускают выполнение.',
        'Stream не хранит данные, он описывает pipeline преобразований.',
        'Нужно быть осторожным с `forEach` и побочными эффектами; лучше собирать результат через `collect`.',
        'Параллельные стримы (`parallelStream`) не всегда быстрее и требуют потокобезопасности.',
        'Выбор между stream и обычным циклом зависит от читаемости и профиля нагрузки.',
      ],
      interviewFocus: [
        {
          question: 'Почему stream называют «ленивым»?',
          expectedAnswer:
            'Промежуточные операции не выполняются сразу; выполнение происходит только при терминальной операции.',
        },
        {
          question: 'Почему `parallelStream()` может ухудшить производительность?',
          expectedAnswer:
            'Накладные расходы на распараллеливание, контеншн, маленькие коллекции, неблокирующая/блокирующая работа; не всегда есть выигрыш.',
        },
      ],
      codeExample: {
        title: 'Pipeline: фильтрация + преобразование + группировка',
        language: 'java',
        snippet: `import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class StreamDemo {
    public Map<String, Long> countByPrefix(List<String> values) {
        return values.stream()
            .filter(v -> v != null && !v.isEmpty())
            .collect(Collectors.groupingBy(v -> v.substring(0, 1), Collectors.counting()));
    }
}`,
        walkthrough: [
          'Фильтрация убирает пустые/нулевые значения.',
          'groupingBy группирует по первому символу и считает количество.',
        ],
        commonPitfall: 'Использовать stream с побочными эффектами (мутация внешних коллекций) вместо `collect`.',
        productionNote:
          'Для читаемости и отладки полезно держать stream-пайплайны короткими и разбивать на шаги, если логика сложная.',
      },
      glossary: [
        {
          term: 'Stream API',
          meaning:
            'Подход к обработке коллекций как конвейера шагов (`filter -> map -> collect`), где данные не меняются “на месте”, а проходят через цепочку операций.',
        },
        {
          term: 'map',
          meaning:
            'Преобразование каждого элемента в новый вид. Например, из `User` получить `user.getName()`. Метод `map` принимает `Function<T, R>`.',
        },
        {
          term: 'filter',
          meaning:
            'Отбор элементов по условию (`true/false`). Всё, что не прошло условие, из потока убирается. Метод `filter` принимает `Predicate<T>`.',
        },
        {
          term: 'reduce',
          meaning:
            'Сведение набора элементов к одному результату (например, сумма, произведение, объединение). В `reduce` обычно передают `BinaryOperator<T>` или аккумулятор типа `BiFunction`.',
        },
        {
          term: 'Predicate',
          meaning: 'Функция-условие для `filter`: принимает элемент и возвращает `true/false`.',
        },
        {
          term: 'Function',
          meaning: 'Функция-преобразование для `map`: принимает `T`, возвращает `R`.',
        },
        {
          term: 'Consumer',
          meaning: 'Функция-действие для `forEach`: принимает элемент и ничего не возвращает.',
        },
        {
          term: 'Supplier',
          meaning: 'Функция-источник значений: ничего не принимает и возвращает результат.',
        },
        {
          term: 'Intermediate operation',
          meaning:
            'Промежуточная операция stream (`map`, `filter`, `sorted`). «Ленивая» = не выполняется сразу: она лишь собирает цепочку действий. Реальная обработка начинается только при терминальной операции, поэтому порядок операций важен (обычно `filter` раньше `map`), и возможны оптимизации (например, `findFirst` может остановиться раньше).',
        },
        {
          term: 'Terminal operation',
          meaning:
            'Терминальная операция stream (`collect`, `count`, `findFirst`, `forEach`): именно она запускает выполнение цепочки действий. Если терминальной операции нет — stream ничего не делает.',
        },
      ],
      estimatedMinutes: 4,
    }),
    topic({
      id: 'homework-2-students-books',
      title: 'Домашнее задание 2: эталонная реализация (Student/Book + file I/O + один stream)',
      quickAnswer:
        'Эталон: есть `Student` с обязательным `List<Book>`, есть чтение из текстового файла в `List<Student>`, и есть один stream без промежуточных переменных, который закрывает все пункты задания и выводит `Optional` год.',
      explainBrief: [
        'Пункт 1: модель данных — `Student` содержит `List<Book>`, у каждого студента минимум 5 книг.',
        'Пункт 2: данные хранятся в текстовом файле, каждая строка описывает одного студента и набор книг.',
        'Пункт 3: чтение файла через `Files.lines(...)` и маппинг строк в `Student`.',
        'Пункт 4: единый stream-пайплайн без промежуточных переменных: печать студентов, flatten книг, сортировка, уникализация, фильтр по году, limit(3), маппинг в год, short-circuit через `findFirst`, вывод через `Optional`.',
        'Важно для собеса: условие "без промежуточных переменных" не запрещает вызовы методов внутри цепочки, но запрещает выносить шаги в отдельные `List`/`Set` переменные.',
      ],
      interviewFocus: [
        {
          question: 'Как доказать, что stream действительно один и без промежуточных переменных?',
          expectedAnswer:
            'Показать единую цепочку от `students.stream()` до `findFirst()`/`ifPresentOrElse(...)` без промежуточных коллекций и временных переменных между шагами.',
        },
        {
          question: 'Где здесь short-circuit и зачем он нужен?',
          expectedAnswer:
            'Short-circuit в `findFirst()`: как только найден первый год после всех фильтров/ограничений, обработка останавливается и не проходит весь поток.',
        },
      ],
      codeExample: {
        title: 'Полный эталон ДЗ-2 с закрытием всех пунктов',
        language: 'java',
        snippet: `import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class Homework2Solution {
    public static void main(String[] args) throws IOException {
        List<Student> students = Files.lines(Path.of("students-books.txt"), StandardCharsets.UTF_8)
            .filter(line -> !line.isBlank())
            .map(Homework2Solution::parseStudent)
            .collect(Collectors.toList());

        students.stream()
            .peek(System.out::println)
            .map(Student::getBooks)
            .flatMap(List::stream)
            .sorted(Comparator.comparingInt(Book::getPages).thenComparing(Book::getTitle))
            .distinct()
            .filter(book -> book.getYear() > 2000)
            .limit(3)
            .map(Book::getYear)
            .findFirst()
            .ifPresentOrElse(
                y -> System.out.println("Год выпуска найденной книги: " + y),
                () -> System.out.println("Такая книга отсутствует")
            );
    }

    private static Student parseStudent(String line) {
        String[] parts = line.split(";");
        String studentName = parts[0].trim();
        List<Book> books = new ArrayList<>();
        for (int i = 1; i < parts.length; i++) {
            String[] bookParts = parts[i].split("\\\\|");
            books.add(new Book(bookParts[0].trim(), Integer.parseInt(bookParts[1].trim()), Integer.parseInt(bookParts[2].trim())));
        }
        if (books.size() < 5) {
            throw new IllegalArgumentException("У студента должно быть минимум 5 книг: " + studentName);
        }
        return new Student(studentName, books);
    }
}

class Student {
    private final String name;
    private final List<Book> books;

    Student(String name, List<Book> books) {
        this.name = name;
        this.books = books;
    }

    List<Book> getBooks() {
        return books;
    }

    public String toString() {
        return "Student{name='" + name + "', books=" + books.size() + "}";
    }
}

class Book {
    private final String title;
    private final int pages;
    private final int year;

    Book(String title, int pages, int year) {
        this.title = title;
        this.pages = pages;
        this.year = year;
    }

    String getTitle() {
        return title;
    }

    int getPages() {
        return pages;
    }

    int getYear() {
        return year;
    }

    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Book)) return false;
        Book book = (Book) o;
        return pages == book.pages && year == book.year && Objects.equals(title, book.title);
    }

    public int hashCode() {
        return Objects.hash(title, pages, year);
    }
}`,
        walkthrough: [
          'Формат файла: `StudentName;title|pages|year;title|pages|year;...`.',
          'Чтение из файла и маппинг в `List<Student>` закрывают пункты 2 и 3.',
          'Единая stream-цепочка от студентов до `findFirst().ifPresentOrElse(...)` закрывает все подпункты пункта 4 без промежуточных переменных.',
        ],
        commonPitfall: 'Разбить цепочку на несколько временных коллекций и нарушить требование "один stream без промежуточных переменных".',
        productionNote:
          'Для учебного задания этот вариант достаточен. Для production обычно добавляют валидацию формата файла и отдельный слой ошибок парсинга.',
      },
      glossary: [
        { term: 'flatMap', meaning: 'Преобразует поток коллекций в единый поток элементов.' },
        { term: 'Short-circuit', meaning: 'Операция, которая может завершить обработку раньше полного прохода по потоку.' },
        { term: 'Optional', meaning: 'Контейнер для значения, которое может отсутствовать.' },
      ],
      estimatedMinutes: 7,
    }),
  ],
};

