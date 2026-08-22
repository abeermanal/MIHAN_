export interface FreeResource {
  title: string;
  url: string;
  type: "article" | "video" | "course" | "practice";
}

/**
 * مصادر تعلم مجانية لكل مهارة — تُستخدم في مسار التعلم
 * وصفحة تفاصيل الفرصة للمهارات الناقصة.
 */
export const FREE_RESOURCES: Record<string, FreeResource[]> = {
  HTML: [
    { title: "freeCodeCamp — Responsive Web Design", url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/", type: "course" },
    { title: "MDN — أساسيات HTML", url: "https://developer.mozilla.org/ar/docs/Learn/Getting_started_with_the_web/HTML_basics", type: "article" },
    { title: "W3Schools HTML Tutorial", url: "https://www.w3schools.com/html/", type: "article" },
  ],
  CSS: [
    { title: "freeCodeCamp — Responsive Web Design", url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/", type: "course" },
    { title: "MDN — تنسيق CSS", url: "https://developer.mozilla.org/ar/docs/Learn/CSS", type: "article" },
    { title: "W3Schools CSS Tutorial", url: "https://www.w3schools.com/css/", type: "article" },
  ],
  JavaScript: [
    { title: "freeCodeCamp — JavaScript Algorithms and Data Structures", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/", type: "course" },
    { title: "MDN — جافاسكربت", url: "https://developer.mozilla.org/ar/docs/Web/JavaScript", type: "article" },
    { title: "JavaScript.info (عربي متاح)", url: "https://javascript.info/", type: "article" },
  ],
  Python: [
    { title: "Kaggle Learn — Python", url: "https://www.kaggle.com/learn/python", type: "course" },
    { title: "The Official Python Tutorial", url: "https://docs.python.org/3/tutorial/", type: "article" },
    { title: "freeCodeCamp — Scientific Computing with Python", url: "https://www.freecodecamp.org/learn/scientific-computing-with-python/", type: "course" },
  ],
  SQL: [
    { title: "SQLBolt — دروس تفاعلية", url: "https://sqlbolt.com/", type: "practice" },
    { title: "Kaggle Learn — Intro to SQL", url: "https://www.kaggle.com/learn/intro-to-sql", type: "course" },
    { title: "SQLZoo", url: "https://sqlzoo.net/", type: "practice" },
  ],
  "Data Analysis": [
    { title: "Kaggle Learn — Data Analysis", url: "https://www.kaggle.com/learn/data-analysis", type: "course" },
    { title: "Google Data Analytics (مشاهدة مجانية)", url: "https://www.coursera.org/professional-certificates/google-data-analytics", type: "course" },
  ],
  "Problem Solving": [
    { title: "Khan Academy — الخوارزميات", url: "https://ar.khanacademy.org/computing/computer-science/algorithms", type: "video" },
    { title: "HackerRank — Practice", url: "https://www.hackerrank.com/domains/skills-checklist", type: "practice" },
  ],
  Communication: [
    { title: "مهارات التواصل الفعال — قناة يوتيوب التعليمية", url: "https://www.youtube.com/results?search_query=%D9%85%D9%87%D8%A7%D8%B1%D8%A7%D8%AA+%D8%A7%D9%84%D8%AA%D9%88%D8%A7%D8%B5%D9%84+%D8%A7%D9%84%D9%81%D8%B9%D8%A7%D9%84", type: "video" },
    { title: "edX — Communicating Effectively (مجاني للمراجعة)", url: "https://www.edx.org/learn/communication", type: "course" },
  ],
  Creativity: [
    { title: "Canva Design School", url: "https://www.canva.com/designschool/", type: "course" },
    { title: "Coursera — Ignite Your Everyday Creativity (مجاني للمراجعة)", url: "https://www.coursera.org/learn/creativity-innovation", type: "course" },
  ],
  "Project Management": [
    { title: "Google Project Management (مشاهدة مجانية)", url: "https://www.coursera.org/professional-certificates/google-project-management", type: "course" },
    { title: "Khan Academy — إدارة الوقت والمشاريع", url: "https://ar.khanacademy.org/", type: "video" },
  ],
  "UI/UX Design": [
    { title: "Figma — Learn Design Basics", url: "https://help.figma.com/hc/en-us/categories/360002051613", type: "course" },
    { title: "Google UX Design (مشاهدة مجانية)", url: "https://www.coursera.org/professional-certificates/google-ux-design", type: "course" },
    { title: "Laws of UX", url: "https://lawsofux.com/", type: "article" },
  ],
  "Digital Marketing": [
    { title: "Google Digital Garage — أساسيات التسويق الرقمي (شهادة مجانية)", url: "https://learndigital.withgoogle.com/digitalgarage/course/digital-marketing", type: "course" },
    { title: "Meta Blueprint — free courses", url: "https://www.facebook.com/business/learn", type: "course" },
  ],
  "Cybersecurity Basics": [
    { title: "TryHackMe — Pre Security Path (غرف مجانية)", url: "https://tryhackme.com/path/outline/presecurity", type: "practice" },
    { title: "Cisco Skills for All — Introduction to Cybersecurity", url: "https://skillsforall.com/course/introduction-cybersecurity", type: "course" },
    { title: "Google Cybersecurity (مشاهدة مجانية)", url: "https://www.coursera.org/professional-certificates/google-cybersecurity", type: "course" },
  ],
};

export function getResourcesForSkill(nameEn: string): FreeResource[] {
  return FREE_RESOURCES[nameEn] ?? [];
}
