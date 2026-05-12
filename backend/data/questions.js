'use strict';

/**
 * Seed data — plain string literals throughout.
 * Characters like <, >, & inside question/option text are intentionally
 * kept as raw characters. They will be stored verbatim in MongoDB and
 * returned via JSON without any HTML interpretation.
 */
const questions = [
  // ─────────────────────────── HTML ───────────────────────────
  {
    subject: 'html',
    question: 'ما هو الشكل الصحيح لعنصر HTML5 الذي لا يحتاج وسم إغلاق؟',
    options: ['<br></br>', '<br/>', '<br>', '<linebreak>'],
    correct: 2
  },
  {
    subject: 'html',
    question: 'أي وسم يُستخدم لتعريف القائمة غير المرتبة؟',
    options: ['<ol>', '<list>', '<ul>', '<dl>'],
    correct: 2
  },
  {
    subject: 'html',
    question: 'ما الغرض من خاصية alt في وسم الصورة؟',
    options: [
      'تحديد حجم الصورة',
      'نص بديل عند عدم تحميل الصورة',
      'تحديد اسم الملف',
      'إضافة تأثير بصري'
    ],
    correct: 1
  },
  {
    subject: 'html',
    question: 'أي وسم HTML يُحدد المعلومات الوصفية للصفحة؟',
    options: ['<head>', '<meta>', '<info>', '<data>'],
    correct: 1
  },
  {
    subject: 'html',
    question: 'ما الفرق بين <section> و <div> في HTML5؟',
    options: [
      'لا فرق بينهما',
      '<section> لها معنى دلالي أما <div> فهي محايدة',
      '<div> أسرع في التحميل',
      '<section> لا تقبل CSS'
    ],
    correct: 1
  },
  {
    subject: 'html',
    question: 'أي من الآتي يُنشئ حقل إدخال للبريد الإلكتروني مع التحقق التلقائي؟',
    options: [
      '<input type="text">',
      '<input type="mail">',
      '<input type="email">',
      '<input type="address">'
    ],
    correct: 2
  },
  {
    subject: 'html',
    question: 'ما وظيفة وسم <figure> في HTML5؟',
    options: [
      'رسم أشكال هندسية',
      'تجميع محتوى مستقل كالصور مع تعليقاتها',
      'تعريف جدول بيانات',
      'إنشاء نموذج'
    ],
    correct: 1
  },
  {
    subject: 'html',
    question: 'أي خاصية تجعل حقل الإدخال إلزامياً قبل إرسال النموذج؟',
    options: ['mandatory', 'validate', 'required', 'important'],
    correct: 2
  },
  {
    subject: 'html',
    question: 'ما الوسم المستخدم لتضمين فيديو في HTML5؟',
    options: ['<movie>', '<media>', '<embed>', '<video>'],
    correct: 3
  },
  {
    subject: 'html',
    question: 'أي وسم يُستخدم لتعريف منطقة قابلة للنقر داخل خريطة صور؟',
    options: ['<zone>', '<area>', '<map>', '<click>'],
    correct: 1
  },
  {
    subject: 'html',
    question: 'ما معنى خاصية defer في وسم <script>؟',
    options: [
      'تحميل السكريبت بعد اكتمال تحليل HTML',
      'تأجيل تنفيذ CSS',
      'تعطيل السكريبت',
      'تكرار تحميل السكريبت'
    ],
    correct: 0
  },
  {
    subject: 'html',
    question: 'أي عنصر HTML يُمثل تقدماً أو إتمام مهمة؟',
    options: ['<meter>', '<gauge>', '<progress>', '<status>'],
    correct: 2
  },

  // ─────────────────────────── CSS ────────────────────────────
  {
    subject: 'css',
    question: 'ما الفرق بين em و rem في CSS؟',
    options: [
      'لا فرق',
      'em نسبي للعنصر الأب، rem نسبي للعنصر الجذر',
      'rem أكبر دائماً من em',
      'em للنصوص فقط'
    ],
    correct: 1
  },
  {
    subject: 'css',
    question: 'ما خاصية CSS التي تتحكم في ترتيب عناصر Flexbox؟',
    options: ['flex-order', 'order', 'z-index', 'position'],
    correct: 1
  },
  {
    subject: 'css',
    question: 'ما قيمة display التي تجعل العنصر يختفي مع الاحتفاظ بمساحته؟',
    options: [
      'display: none',
      'visibility: hidden',
      'opacity: 0',
      'b و c معاً'
    ],
    correct: 1
  },
  {
    subject: 'css',
    question: 'أي محدد CSS يستهدف العنصر الأول من نوعه داخل الأب؟',
    options: [':first-child', ':first-of-type', ':nth-child(1)', 'a و c معاً'],
    correct: 1
  },
  {
    subject: 'css',
    question: 'ما الخاصية المستخدمة لإنشاء تخطيط شبكي ثنائي الأبعاد؟',
    options: ['display: flex', 'display: grid', 'display: table', 'float: grid'],
    correct: 1
  },
  {
    subject: 'css',
    question: 'ما معنى box-sizing: border-box؟',
    options: [
      'إضافة الحدود خارج العرض المحدد',
      'تضمين الحدود والحشو داخل العرض المحدد',
      'إزالة جميع الحدود',
      'تحديد شكل الصندوق'
    ],
    correct: 1
  },
  {
    subject: 'css',
    question: 'أي دالة CSS تُستخدم لقراءة متغيرات CSS المخصصة؟',
    options: ['var()', 'calc()', 'env()', 'custom()'],
    correct: 0
  },
  {
    subject: 'css',
    question: 'ما الفرق بين position: absolute و position: fixed؟',
    options: [
      'لا فرق',
      'absolute يتبع أقرب أب موضوع، fixed يتبع نافذة المتصفح',
      'fixed أسرع أداءً',
      'absolute يتبع الصفحة كاملة'
    ],
    correct: 1
  },
  {
    subject: 'css',
    question: 'ما خاصية CSS المسؤولة عن تحريك العناصر بسلاسة عند تغير الحالة؟',
    options: ['animation', 'transition', 'transform', 'motion'],
    correct: 1
  },
  {
    subject: 'css',
    question: 'أي قيمة لخاصية overflow تُظهر شريط التمرير عند الحاجة فقط؟',
    options: [
      'overflow: scroll',
      'overflow: hidden',
      'overflow: auto',
      'overflow: visible'
    ],
    correct: 2
  },
  {
    subject: 'css',
    question: 'ما دالة CSS المستخدمة لحساب قيم ديناميكية؟',
    options: ['compute()', 'calc()', 'math()', 'evaluate()'],
    correct: 1
  },
  {
    subject: 'css',
    question: 'ما الخاصية التي تُحدد نقطة ارتكاز التحويل في CSS؟',
    options: ['transform-center', 'origin-point', 'transform-origin', 'pivot-point'],
    correct: 2
  },

  // ─────────────────────────── JavaScript ─────────────────────
  {
    subject: 'javascript',
    question: 'ما الفرق بين == و === في JavaScript؟',
    options: [
      'لا فرق',
      '=== يقارن القيمة فقط',
      '=== يقارن القيمة والنوع معاً',
      '== أسرع في التنفيذ'
    ],
    correct: 2
  },
  {
    subject: 'javascript',
    question: 'ما ناتج: console.log(typeof []) ؟',
    options: ["'array'", "'object'", "'list'", "'undefined'"],
    correct: 1
  },
  {
    subject: 'javascript',
    question: 'ما الفرق بين Promise و async/await؟',
    options: [
      'لا فرق',
      'async/await مجرد صياغة أجمل للـ Promise',
      'async/await أسرع أداءً',
      'Promise لا يعمل في المتصفحات الحديثة'
    ],
    correct: 1
  },
  {
    subject: 'javascript',
    question: 'ما ناتج: [1, 2, 3].map(x => x * 2) ؟',
    options: ['[1, 2, 3]', '[2, 4, 6]', '6', 'undefined'],
    correct: 1
  },
  {
    subject: 'javascript',
    question: 'ما الغرض من دالة debounce في JavaScript؟',
    options: [
      'تسريع تنفيذ الدوال',
      'تأخير تنفيذ دالة حتى توقف الحدث لفترة محددة',
      'إلغاء تنفيذ الدالة',
      'تكرار تنفيذ الدالة'
    ],
    correct: 1
  },
  {
    subject: 'javascript',
    question: 'ما ناتج: console.log(0.1 + 0.2 === 0.3) ؟',
    options: ['true', 'false', 'undefined', 'NaN'],
    correct: 1
  },
  {
    subject: 'javascript',
    question: 'ما الفرق بين null و undefined في JavaScript؟',
    options: [
      'هما متماثلان',
      'null غياب متعمد للقيمة، undefined تعني عدم التعريف',
      'undefined تُعيّن يدوياً فقط',
      'null لا يمكن استخدامه في المقارنات'
    ],
    correct: 1
  },
  {
    subject: 'javascript',
    question: 'ما ناتج: typeof function(){} ؟',
    options: ["'object'", "'method'", "'function'", "'callable'"],
    correct: 2
  },
  {
    subject: 'javascript',
    question: 'ما الـ Event Loop في JavaScript؟',
    options: [
      'حلقة تكرار عادية',
      'آلية تتيح تنفيذ كود غير متزامن في بيئة أحادية الخيط',
      'طريقة للتعامل مع الأخطاء',
      'نوع من أنواع الـ Promise'
    ],
    correct: 1
  },
  {
    subject: 'javascript',
    question: 'ما الفرق بين call() و apply() في JavaScript؟',
    options: [
      'لا فرق بينهما',
      'call تمرر الوسطاء بشكل فردي، apply تمررهم كمصفوفة',
      'apply لا تقبل وسطاء',
      'call لا تغير قيمة this'
    ],
    correct: 1
  },
  {
    subject: 'javascript',
    question: "ما ناتج: [... 'hello'] ؟",
    options: ["['hello']", "['h','e','l','l','o']", 'error', 'undefined'],
    correct: 1
  },
  {
    subject: 'javascript',
    question: 'ما الـ Prototype Chain في JavaScript؟',
    options: [
      'سلسلة من الوعود',
      'آلية الوراثة عبر كائن النموذج الأولي',
      'نوع من المصفوفات',
      'طريقة ربط الـ DOM'
    ],
    correct: 1
  }
];

module.exports = questions;
