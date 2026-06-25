export interface JobVocabItem {
  id: string;
  word: string;
  hiragana: string;
  romaji: string;
  meaning_en: string;
  meaning_hi: string;
  situation: string;
  notes: string;
}

export interface KeigoVerbItem {
  id: string;
  meaning: string;
  plain: string;
  polite: string; // 丁寧語
  honorific: string; // 尊敬語 (used for client/boss actions)
  humble: string; // 謙譲語 (used for self actions)
  example: string;
}

export interface EmailTemplateItem {
  id: string;
  title: string;
  category: string;
  subject: string;
  body: string;
  explanation_en: string;
  explanation_hi: string;
  variables: string[];
}

export interface InterviewQuestionItem {
  id: string;
  question: string;
  hiragana: string;
  meaning_en: string;
  meaning_hi: string;
  modelAnswer: string;
  modelAnswerHiragana: string;
  modelAnswerEn: string;
  advice_en: string;
  advice_hi: string;
}

export const industryLexicons: Record<string, { title: string; jpTitle: string; description: string; vocab: JobVocabItem[] }> = {
  factory: {
    title: 'Factory Japanese',
    jpTitle: '工場日本語',
    description: 'Specialized terms for safety, assembly operations, shift scheduling, and reporting defect issues on the factory floor.',
    vocab: [
      {
        id: 'fact-001',
        word: '安全第一',
        hiragana: 'あんぜんだいいち',
        romaji: 'anzen daiichi',
        meaning_en: 'Safety first',
        meaning_hi: 'सुरक्षा सर्वोपरि',
        situation: 'Displayed on warning banners and repeated during morning briefings (Chourei).',
        notes: 'Fundamental slogan in Japanese manufacturing and industrial environments.'
      },
      {
        id: 'fact-002',
        word: '不良品',
        hiragana: 'ふりょうひん',
        romaji: 'furyouhin',
        meaning_en: 'Defective product / Reject item',
        meaning_hi: 'दोषपूर्ण उत्पाद / रिजेक्ट',
        situation: 'Reporting defects to the floor supervisor during inspection.',
        notes: 'Always separate defective products immediately to prevent line contamination.'
      },
      {
        id: 'fact-003',
        word: '点検',
        hiragana: 'てんけん',
        romaji: 'tenken',
        meaning_en: 'Inspection / Routine check',
        meaning_hi: 'जांच / नियमित निरीक्षण',
        situation: 'Performing startup checks on heavy machinery or conveyors.',
        notes: 'Often paired as "shigyou tenken" (pre-work inspection).'
      },
      {
        id: 'fact-004',
        word: '非常停止',
        hiragana: 'ひじょうていし',
        romaji: 'hijou teishi',
        meaning_en: 'Emergency stop',
        meaning_hi: 'आपातकालीन रोक / इमरजेंसी स्टॉप',
        situation: 'Pressing the red stop button if a machine malfunctions or jams.',
        notes: 'Learn the location of the emergency button before starting any machine operation.'
      },
      {
        id: 'fact-005',
        word: 'ヘルメット着用',
        hiragana: 'へるめっとちゃくよう',
        romaji: 'herumetto chakuyou',
        meaning_en: 'Wear a safety helmet',
        meaning_hi: 'सुरक्षा हेलमेट पहनना',
        situation: 'Instruction displayed at safety zone boundaries.',
        notes: 'Strict compliance is enforced in all heavy construction and assembly units.'
      }
    ]
  },
  caregiver: {
    title: 'Caregiver Japanese',
    jpTitle: '介護日本語',
    description: 'Caring vocabulary, medical essentials, gentle commands, and client reporting for senior care facilities.',
    vocab: [
      {
        id: 'care-001',
        word: '介助',
        hiragana: 'かいじょ',
        romaji: 'kaijo',
        meaning_en: 'Nursing care assistance',
        meaning_hi: 'सहायता / देखभाल',
        situation: 'Assisting a senior citizen with daily activities (eating, walking, bathing).',
        notes: 'Commonly used in compound phrases like "Shokuji kaijo" (eating assistance).'
      },
      {
        id: 'care-002',
        word: '車椅子',
        hiragana: 'くるまいす',
        romaji: 'kurumaisu',
        meaning_en: 'Wheelchair',
        meaning_hi: 'व्हीलचेयर / पहिएदार कुर्सी',
        situation: 'Helping a senior sit down or transferring them safely.',
        notes: 'Ensure the wheel brakes (brakki) are locked before helping the person transfer.'
      },
      {
        id: 'care-003',
        word: '体調',
        hiragana: 'たいちょう',
        romaji: 'taichou',
        meaning_en: 'Physical health condition',
        meaning_hi: 'शारीरिक स्थिति / स्वास्थ्य',
        situation: 'Asking a senior client how they feel in the morning.',
        notes: 'Example: "Taichou wa ikaga desu ka?" (How is your health today?).'
      },
      {
        id: 'care-004',
        word: '水分補給',
        hiragana: 'すいぶんほきゅう',
        romaji: 'suibun hokyuu',
        meaning_en: 'Hydration / Intake of fluids',
        meaning_hi: 'जलयोजन / पानी पीना',
        situation: 'Reminding residents to drink tea or water during hot summer hours.',
        notes: 'Crucial for preventing heat stroke (netsuchuushou) among elderly patients.'
      },
      {
        id: 'care-005',
        word: '床ずれ',
        hiragana: 'とこずれ',
        romaji: 'tokozure',
        meaning_en: 'Bedsore / Pressure ulcer',
        meaning_hi: 'बेडसोर / बिस्तर का घाव',
        situation: 'Changing a patient\'s position regularly to prevent skin irritations.',
        notes: 'Clinical record-keeping requires noting bed position cycles.'
      }
    ]
  },
  hotel: {
    title: 'Hotel & Hospitality',
    jpTitle: 'ホテル日本語',
    description: 'Front desk operations, ultra-polite Keigo customer service, reservations, check-in flows, and handling client complaints.',
    vocab: [
      {
        id: 'hot-001',
        word: 'ご案内',
        hiragana: 'ごあんない',
        romaji: 'go-annai',
        meaning_en: 'Guide / Escort / Show the way',
        meaning_hi: 'मार्गदर्शन करना / कमरा दिखाना',
        situation: 'Leading checked-in guests to their hotel suites or elevator bays.',
        notes: 'Using the honorific prefix "go-" shows respect. Verb form: "Go-annai itashimasu".'
      },
      {
        id: 'hot-002',
        word: '満室',
        hiragana: 'まんしつ',
        romaji: 'manshitsu',
        meaning_en: 'Fully booked / No vacant rooms',
        meaning_hi: 'सभी कमरे भरे होना / फुल बुक',
        situation: 'Responding politely to guests looking for walk-in availability.',
        notes: 'Example: "Moushiwake gozaimasen, tadaima manshitsu de gozaimasu".'
      },
      {
        id: 'hot-003',
        word: '貴重品',
        hiragana: 'きちょうひん',
        romaji: 'kichouhin',
        meaning_en: 'Valuables / Highly valuable items',
        meaning_hi: 'कीमती सामान',
        situation: 'Explaining safe lock boxes or deposit options to arriving international guests.',
        notes: 'Never handle guest valuables directly. Always point to safe boxes.'
      },
      {
        id: 'hot-004',
        word: 'チェックアウト',
        hiragana: 'ちぇっくあうと',
        romaji: 'chekkuauto',
        meaning_en: 'Check-out',
        meaning_hi: 'चेक-आउट करना / प्रस्थान',
        situation: 'Settling credit cards and receiving keys from departing visitors.',
        notes: 'Standard check-out time is generally 10:00 AM or 11:00 AM in traditional ryokan.'
      },
      {
        id: 'hot-005',
        word: 'ご要望',
        hiragana: 'ごようぼう',
        romaji: 'go-youbou',
        meaning_en: 'Special request / Customer demand',
        meaning_hi: 'विशेष अनुरोध / मांग',
        situation: 'Checking reservations for notes regarding feather pillows or dietary requirements.',
        notes: 'A respectful business term. Verb: "Goyoubou ni kotaeru" (meet customer demands).'
      }
    ]
  },
  restaurant: {
    title: 'Restaurant Japanese',
    jpTitle: '飲食店日本語',
    description: 'Order taking, greeting customers, kitchen commands, allergen checks, payments, and dining hospitality.',
    vocab: [
      {
        id: 'rest-001',
        word: 'いらっしゃいませ',
        hiragana: 'いらっしゃいませ',
        romaji: 'irasshaimase',
        meaning_en: 'Welcome to the shop (retail/dining)',
        meaning_hi: 'आपका स्वागत है',
        situation: 'Welcoming customers the instant they step through the main entrance doors.',
        notes: 'Say this loudly and clearly in unison with other staff members. Do not wait.'
      },
      {
        id: 'rest-002',
        word: 'ご注文',
        hiragana: 'ごちゅうもん',
        romaji: 'go-chuumon',
        meaning_en: 'Order (from client)',
        meaning_hi: 'ऑर्डर / आदेश',
        situation: 'Approaching tables to record meals. "Go-chuumon wa okimari desu ka?"',
        notes: '"Go-" prefix is crucial. Always repeat orders back to double check.'
      },
      {
        id: 'rest-003',
        word: 'お会計',
        hiragana: 'おかいけい',
        romaji: 'o-kaikei',
        meaning_en: 'Bill payment / Settlement of check',
        meaning_hi: 'बिल भुगतान / पैसे चुकाना',
        situation: 'Processing payments at the register. "O-kaikei wa go-sen en desu".',
        notes: 'Receive money with both hands using "o-azkari itashimasu" (I temporarily receive).'
      },
      {
        id: 'rest-004',
        word: 'アレルギー',
        hiragana: 'あれるぎー',
        romaji: 'arerugii',
        meaning_en: 'Food allergy',
        meaning_hi: 'एलर्जी (खाद्य पदार्थ)',
        situation: 'Confirming if ingredients contain milk, eggs, peanuts, or buckwheat.',
        notes: 'Crucial for international guests. Double check directly with the chef.'
      },
      {
        id: 'rest-005',
        word: 'お冷',
        hiragana: 'おひや',
        romaji: 'ohiya',
        meaning_en: 'Cold drinking water',
        meaning_hi: 'ठंडा पीने का पानी',
        situation: 'Serving glasses of free water immediately after customer is seated.',
        notes: 'A restaurant-industry jargon term. Never use this when drinking at home.'
      }
    ]
  },
  it: {
    title: 'IT & Software Development',
    jpTitle: 'ＩＴ日本語',
    description: 'System deployment, database schemas, Scrum ceremonies, client briefs, software bug reporting, and Katakana technology loanwords.',
    vocab: [
      {
        id: 'it-001',
        word: '仕様書',
        hiragana: 'しようしょ',
        romaji: 'shiyousho',
        meaning_en: 'Specification document / Spec sheet',
        meaning_hi: 'विनिर्देश दस्तावेज़ / स्पेक शीट',
        situation: 'Reviewing database or API structures before starting coding.',
        notes: 'Following the "shiyousho" strictly is highly valued in Japanese software projects.'
      },
      {
        id: 'it-002',
        word: '開発環境',
        hiragana: 'かいはつかんきょう',
        romaji: 'kaihatsu kankyou',
        meaning_en: 'Development environment',
        meaning_hi: 'विकास परिवेश / डेवलपमेंट एनवायरनमेंट',
        situation: 'Setting up local node modules or configuring backend docker paths.',
        notes: 'Contrast with "honban kankyou" (production environment).'
      },
      {
        id: 'it-003',
        word: '不具合',
        hiragana: 'ふぐあい',
        romaji: 'fuguai',
        meaning_en: 'Bug / Flaw / Malfunction',
        meaning_hi: 'बग / खामी / तकनीकी खराबी',
        situation: 'Reporting a software glitch or failing test case in Jira ticket.',
        notes: 'Using "fuguai" is considered more professional than "bagu" in official reports.'
      },
      {
        id: 'it-004',
        word: '本番リリース',
        hiragana: 'ほんばんりりーす',
        romaji: 'honban ririisu',
        meaning_en: 'Production deployment / Release to live',
        meaning_hi: 'उत्पादन परिनियोजन / लाइव रिलीज',
        situation: 'Scheduling system freeze and code push to live servers.',
        notes: 'Usually happens late night or during hours of low system traffic.'
      },
      {
        id: 'it-005',
        word: '進捗状況',
        hiragana: 'しんちょくじょうきょう',
        romaji: 'shinchoku joukyou',
        meaning_en: 'Progress status',
        meaning_hi: 'प्रगति की स्थिति / प्रोग्रेस स्टेटस',
        situation: 'Updating teammates during standup meetings. "Shinchoku wa dou desu ka?"',
        notes: '"Shinchoku okure" means the ticket is running behind schedule.'
      }
    ]
  },
  office: {
    title: 'Office & Business Japanese',
    jpTitle: 'オフィス日本語',
    description: 'Corporate etiquette, scheduling meetings, reporting to bosses (Hou-Ren-So), deadliness, and workplace interactions.',
    vocab: [
      {
        id: 'off-001',
        word: 'お疲れ様です',
        hiragana: 'おつかれさまです',
        romaji: 'otsukaresama desu',
        meaning_en: 'Thank you for your hard work',
        meaning_hi: 'कठिन परिश्रम के लिए धन्यवाद / नमस्ते',
        situation: 'Greeting coworkers in halls, starting emails, or when leaving the office.',
        notes: 'The absolute most common office greeting. Never say this to your superior as "gokurousama" (which is condescending).'
      },
      {
        id: 'off-002',
        word: '報告・連絡・相談',
        hiragana: 'ほうこく・れんらく・そうだん',
        romaji: 'houkoku renraku soudan',
        meaning_en: 'Report, Contact, Consult (Hou-Ren-So)',
        meaning_hi: 'रिपोर्ट, संपर्क, परामर्श (हो-रेन-सो)',
        situation: 'Corporate philosophy drilled into all junior employees.',
        notes: 'Shortened as "Hou-Ren-So". Keep communication open to prevent team siloing.'
      },
      {
        id: 'off-003',
        word: '承知いたしました',
        hiragana: 'しょうちいたしました',
        romaji: 'shouchi itashimashita',
        meaning_en: 'Understood / Received (humble business format)',
        meaning_hi: 'समझ गया / स्वीकार किया',
        situation: 'Acknowledging a task request given to you by a manager or direct client.',
        notes: 'Use this instead of "ryoukai desu" (which is casual and inappropriate for superiors).'
      },
      {
        id: 'off-004',
        word: '定時',
        hiragana: 'ていじ',
        romaji: 'teiji',
        meaning_en: 'Regular working hours / Scheduled quitting time',
        meaning_hi: 'नियमित काम के घंटे / जाने का समय',
        situation: 'Leaving the desk right on time. "Teiji ni taisha suru".',
        notes: 'Usually 5:00 PM or 6:00 PM depending on specific corporate contracts.'
      },
      {
        id: 'off-005',
        word: '出張',
        hiragana: 'しゅっちょう',
        romaji: 'shutchou',
        meaning_en: 'Business trip',
        meaning_hi: 'व्यापारिक यात्रा / बिजनेस ट्रिप',
        situation: 'Traveling to audit regional offices or meet client stakeholders.',
        notes: 'Accompanied by reimbursement receipts submitted to accounts (経費精算).'
      }
    ]
  }
};

export const keigoVerbs: KeigoVerbItem[] = [
  {
    id: 'k-001',
    meaning: 'to do (する)',
    plain: 'する (suru)',
    polite: 'します (shimasu)',
    honorific: 'なさいます (nasaimasu)',
    humble: 'いたします (itashimasu)',
    example: 'A: 部長、明日は何をなさいますか？ (Manager, what will you do tomorrow?)\nB: 明日は東京へ出張いたします。 (I will go on a business trip to Tokyo.)'
  },
  {
    id: 'k-002',
    meaning: 'to go / to come (行く・来る)',
    plain: '行く・来る (iku / kuru)',
    polite: '行きます・来ます (ikimasu / kimasu)',
    honorific: 'いらっしゃいます (irasshaimasu)',
    humble: '参ります (mairimasu)',
    example: 'A: もうすぐお客様がいらっしゃいます。 (The customer will arrive shortly.)\nB: すぐにロビーへ参ります。 (I will head to the lobby immediately.)'
  },
  {
    id: 'k-003',
    meaning: 'to say (言う)',
    plain: '言う (iu)',
    polite: '言います (iimasu)',
    honorific: 'おっしゃいます (osshaimasu)',
    humble: '申します (moushimasu)',
    example: 'A: 先ほど社長がおっしゃいました。 (The president said this earlier.)\nB: 私は鈴木と申します。よろしくお願いいたします。 (I am called Suzuki. Nice to meet you.)'
  },
  {
    id: 'k-004',
    meaning: 'to eat / to drink (食べる・飲む)',
    plain: '食べる・飲む (taberu / nomu)',
    polite: '食べます・飲みます (tabemasu / nomimasu)',
    honorific: '召し上がります (meshiagarimasu)',
    humble: 'いただきます (itadakimasu)',
    example: 'A: どうぞ、温かいお茶を召し上がってください。 (Please enjoy this hot green tea.)\nB: ありがとうございます。いただきます。 (Thank you very much. I will partake.)'
  },
  {
    id: 'k-005',
    meaning: 'to look at / to watch (見る)',
    plain: '見る (miru)',
    polite: '見ます (mimasu)',
    honorific: 'ご覧になります (goran ni narimasu)',
    humble: '拝見します (haiken shimasu)',
    example: 'A: このパンフレットをご覧になりましたか？ (Have you looked at this brochure?)\nB: はい、拝見いたしました。 (Yes, I have looked through it.)'
  },
  {
    id: 'k-006',
    meaning: 'to meet / to encounter (会う)',
    plain: '会う (au)',
    polite: '会います (aimasu)',
    honorific: 'お会いになります (o-ai ni narimasu)',
    humble: 'お目にかかります (o-me ni kakarimasu)',
    example: 'A: 本日、鈴木様とお会いになりますか？ (Are you meeting Mr. Suzuki today?)\nB: はい、午後二時にお目にかかる予定です。 (Yes, I am scheduled to meet him at 2:00 PM.)'
  }
];

export const emailTemplates: EmailTemplateItem[] = [
  {
    id: 'em-001',
    title: 'Scheduling a Meeting (日程調整)',
    category: 'Request',
    subject: '打ち合わせ日程のご相談 (Request for Meeting Schedule)',
    body: `[相手の会社名]
[相手の役職・氏名] 様

いつもお世話になっております。
[自分の会社名]の[自分の氏名]でございます。

この度は、新規プロジェクトの件について、対面またはオンラインにて
30分ほどお打ち合わせのお時間をいただけますでしょうか。

私の候補日時としては、以下の通りでございます。
・[日時候補1]
・[日時候補2]
・[日時候補3]

ご都合のよろしい時間帯がございましたら、ご返信いただけますと幸いです。
上記で不都合な場合は、恐れ入りますが候補日をご提示ください。

お忙しいところ恐縮ですが、ご検討のほどよろしくお願い申し上げます。

--------------------------------------------------
[署名 (Signature)]
--------------------------------------------------`,
    explanation_en: 'Use this standard business template to propose a meeting time with client stakeholders. It list options clearly.',
    explanation_hi: 'क्लाइंट के साथ बैठक का समय तय करने के लिए इस औपचारिक ईमेल प्रारूप का उपयोग करें। यह विकल्प स्पष्ट रूप से प्रस्तुत करता है।',
    variables: ['[相手の会社名]', '[相手の役職・氏名]', '[自分の会社名]', '[自分の氏名]', '[日時候補1]', '[日時候補2]', '[日時候補3]', '[署名 (Signature)]']
  },
  {
    id: 'em-002',
    title: 'Apologizing for a Delay (遅延のお詫び)',
    category: 'Apology',
    subject: '【お詫び】提出資料の遅延について (Apology: Delay in Document Submission)',
    body: `[相手の会社名]
[相手の役職・氏名] 様

いつもお世話になっております。
[自分の会社名]の[自分の氏名]でございます。

本日中に提出することをお約束しておりました[資料の名前]につきまして、
社内確認に時間を要しており、期日に遅れてしまう見込みとなりました。

多大なるご迷惑をおかけしますことを、深くお詫び申し上げます。

資料につきましては、明日【[変更後の提出日]】の【[時間]】までに必ず送付いたします。
今後はこのようなことがないよう、進行管理を徹底してまいります。

恐れ入りますが、少々お待ちいただけますようお願い申し上げます。
取り急ぎ、書面にてお詫びとご報告を申し上げます。

--------------------------------------------------
[署名 (Signature)]
--------------------------------------------------`,
    explanation_en: 'Send this immediately if you realize a report, asset, or release will miss the promised deadline. Professionalism rests on prompt reports.',
    explanation_hi: 'यदि आपको लगता है कि कोई रिपोर्ट या प्रोजेक्ट समय पर पूरा नहीं होगा, तो तुरंत यह माफी का ईमेल भेजें। समय पर रिपोर्ट करना पेशेवर तरीका है।',
    variables: ['[相手の会社名]', '[相手の役職・氏名]', '[自分の会社名]', '[自分の氏名]', '[資料の名前]', '[変更後の提出日]', '[時間]', '[署名 (Signature)]']
  },
  {
    id: 'em-003',
    title: 'Thank You for a Meeting (打ち合わせのお礼)',
    category: 'Thank You',
    subject: '本日の打ち合わせの御礼 (Thank You for Today\'s Meeting)',
    body: `[相手の会社名]
[相手の役職・氏名] 様

いつもお世話になっております。
[自分の会社名]の[自分の氏名]でございます。

本日はお忙しい中、貴重なお時間をいただき誠にありがとうございました。
お打ち合わせにて決定した事項を、以下の通り共有いたします。

・[決定事項・次回タスク1]
・[決定事項・次回タスク2]

次回までのタスクにつきましては、[次の期日]までに対応を進めてまいります。
何かご不明な点や追加の要望がございましたら、いつでもご連絡ください。

引き続き、何卒よろしくお願い申し上げます。

--------------------------------------------------
[署名 (Signature)]
--------------------------------------------------`,
    explanation_en: 'Send this prompt follow-up within 2 hours of concluding a business meeting to record decisions and next steps.',
    explanation_hi: 'बैठक समाप्त होने के 2 घंटे के भीतर निर्णयों और अगले कदमों को साझा करने के लिए यह धन्यवाद ईमेल भेजें।',
    variables: ['[相手の会社名]', '[相手の役職・氏名]', '[自分の会社名]', '[自分の氏名]', '[決定事項・次回タスク1]', '[決定事項・次回タスク2]', '[次の期日]', '[署名 (Signature)]']
  }
];

export const interviewQuestions: InterviewQuestionItem[] = [
  {
    id: 'q-001',
    question: '自己紹介をお願いします。',
    hiragana: 'じこしょうかいをおねがいします。',
    meaning_en: 'Please introduce yourself.',
    meaning_hi: 'कृपया अपना परिचय दें।',
    modelAnswer: 'はじめまして。鈴木健太と申します。インドの大学でコンピューターサイエンスを専攻し、卒業後はIT企業でフロントエンド開発に3年間従事いたしました。これまでの経験を活かし、貴社のグローバルな開発チームに貢献したいと考えております。本日はどうぞよろしくお願いいたします。',
    modelAnswerHiragana: 'はじめまして。すずきけんたと申します。インドのだいがくでこんぴゅーたーさいえんすをせんこうし、そつぎょうごはＩＴきぎょうでふろんとえんどかいはつにさんねんかんじゅうじいたしました。これまでのけいけんをいかし、きしゃのぐろーばるなかいはつちーむにこうけんしたいとかんがえております。ほんじつはどうぞよろしくお願いいたします。',
    modelAnswerEn: 'Nice to meet you. My name is Kenta Suzuki. I majored in Computer Science at university in India, and after graduation, I worked in frontend development at an IT firm for three years. I hope to utilize this experience to contribute to your global engineering team. Thank you very much for your time today.',
    advice_en: 'Keep it within 1-2 minutes. Address your name, summary of major skills/career, and a brief polite closing. Do not repeat your entire resume.',
    advice_hi: 'अपना परिचय 1-2 मिनट के भीतर रखें। अपना नाम, प्रमुख कौशल/करियर का सारांश और विनम्र समापन वाक्य कहें। पूरा रिज्यूमे दोहराने से बचें।'
  },
  {
    id: 'q-002',
    question: 'なぜ弊社を志望されたのですか？（志望動機）',
    hiragana: 'なぜへいしゃをしぼうされたのですか？（しぼうどうき）',
    meaning_en: 'Why did you apply to our company? (Motivation)',
    meaning_hi: 'आपने हमारी कंपनी में आवेदन क्यों किया? (प्रेरणा)',
    modelAnswer: '貴社が展開するグローバルECサービスは、高い技術力と迅速な市場展開により世界中のユーザーから支持されています。私もエンジニアとして、最先端の技術環境で人々の生活を便利にするシステム構築に携わりたいと考え、志望いたしました。特に貴社が取り組むAI推薦システムに強い関心を持っております。',
    modelAnswerHiragana: 'きしゃがてんかいするぐろーばるＥＣさーびすは、たかいぎじゅつりょくとじんそくなしじょうてんかいによりせかいじゅうのゆーざーからしじされています。わたしもえんじにあとして、さいせんたんのぎじゅつかんきょうでひとびとのせいかつをべんりにするしすてむこうちくにたずさわりたいとかんがえ、しぼういたしました。とくにきしゃがとりくむＡＩすいせんしすてむにつよいかんしんをもっております。',
    modelAnswerEn: 'Your global e-commerce service is supported by users worldwide due to its high technical standard and rapid market adaptation. As an engineer, I wish to build systems that make people\'s lives convenient within a cutting-edge technical environment. I am particularly interested in your AI-driven recommendation initiatives.',
    advice_en: 'Highlight what makes the company unique (use "Kisha" respectfully) and align it with your own career goals and capabilities.',
    advice_hi: 'कंपनी की विशिष्टता को रेखांकित करें (आदरपूर्वक "Kisha" कहें) और इसे अपने करियर लक्ष्यों और क्षमताओं के साथ संरेखित करें।'
  },
  {
    id: 'q-003',
    question: 'ご自身の長所と短所を教えてください。',
    hiragana: 'ごじしんのちょうしょとたんしょをおしえてください。',
    meaning_en: 'What are your strengths and weaknesses?',
    meaning_hi: 'आपकी ताकत और कमजोरियां क्या हैं?',
    modelAnswer: '私の長所は、課題に対する粘り強さと問題解決能力です。困難なバグに直面しても、原因を論理的に分析し解決するまでやり遂げます。短所は、一つのことに集中しすぎて周囲の進捗が見えなくなることがある点です。そのため、現在は定期的アラームを設定し、定期的にチーム全体に目を配るよう意識しています。',
    modelAnswerHiragana: 'わたしのちょうしょは、かだいに対するねばりつよさともんだいかいけつのうりょくです。こんなんなばぐにちょくめんしても、げんいんをろんりてきにぶんせきしかいけつするまでやりとげます。たんしょは、ひとつのことにしゅうちゅうしすぎてしゅういのしんちょくがみえなくなることがあるてんです。そのため、げんざいはていきてきあらーむをせっていし、ていきてきにちーむぜんたいにめをくばるよういしきしています。',
    modelAnswerEn: 'My strength lies in my perseverance and problem-solving skills when facing obstacles. Even in complex bugs, I logically analyze and stick with it until resolved. My weakness is focusing too deeply on one task, sometimes losing sight of surrounding progress. To counter this, I now set reminder alarms to intentionally check in with the team regularly.',
    advice_en: 'Make sure your weakness is presented with a proactive solution or behavioral adjustment that you are actively practicing.',
    advice_hi: 'सुनिश्चित करें कि आपकी कमजोरी को एक सक्रिय समाधान या सुधारात्मक व्यवहार के साथ प्रस्तुत किया जाए जिसे आप वर्तमान में अपना रहे हैं।'
  }
];
