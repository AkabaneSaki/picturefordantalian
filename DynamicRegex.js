(async function() {
    // 等待 TavernHelper 初始化
    // 如果您将此作为插件使用，这行非常重要
    if (!window.TavernHelper) {
        console.log('等待 TavernHelper 加载...');
        while (!window.TavernHelper) await new Promise(r => setTimeout(r, 500));
    }

    const { TavernHelper, SillyTavern, toastr } = window;

    // ==========================================
    // 🎭 正则仓库配置 (在这里添加你的角色和正则)
    // ==========================================
    const REGEX_VAULT = {
        "妲丽安": {
            scriptName: "Dynamic-妲丽安美化", // 建议加统一前缀以便脚本识别管理
            findRegex: "/<bubble name=\"(.*?)\" mood=\"(.*?)\">\\s*[「]?\\s*([\\s\\S]*?)\\s*[」]?\\s*<\\/bubble>/g", // 示例正则，请替换为你真实的正则
            replaceString: "<div class=\"phantom-library-container\"><div class=\"leather-texture\"></div><div class=\"magic-seal-bg\"></div><div class=\"floating-dust\"></div><div class=\"book-spine-left\"></div><div class=\"book-spine-gold-line\"></div><div class=\"seal-complex\"><div class=\"lock-base\"></div><div class=\"chain-cross\"></div><div class=\"keyhole-glow\"></div><div class=\"page-float p1\"></div><div class=\"page-float p2\"></div><div class=\"page-float p3\"></div></div><div class=\"portrait-frame-square\"><div class=\"portrait-inner\" style=\"background-image: url('https://raw.githubusercontent.com/AkabaneSaki/picturefordantalian/refs/heads/main/$2.png');\"></div><div class=\"frame-overlay\"></div></div><div class=\"content-wrapper\"><div class=\"gothic-header\"><div class=\"wax-seal\"></div><span class=\"gothic-name\">$1</span><div class=\"ornament-line\"></div></div><div class=\"page-body\">$3</div></div></div><style>@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=UnifrakturMaguntia&display=swap');.phantom-library-container{--dalian-black:#0f0f12;--dalian-red:#4a0404;--dalian-crimson:#720e1e;--dalian-gold:#c5a059;--dalian-paper:#e6dfcc;--bg-gradient:linear-gradient(135deg,#1a0505 0%,#080808 100%);position:relative;margin:15px 5px 15px 20px;padding:15px 20px 15px 20px;background:var(--bg-gradient);border:1px solid #331010;border-radius:2px 6px 6px 2px;box-shadow:inset 0 0 40px rgba(0,0,0,0.9),0 10px 25px rgba(0,0,0,0.7),0 0 1px var(--dalian-gold);font-family:'Times New Roman',serif;overflow:hidden;min-height:140px;transition:all 0.5s ease}.leather-texture{position:absolute;top:0;left:0;width:100%;height:100%;background-image:radial-gradient(rgba(255,255,255,0.03) 1px,transparent 1px);background-size:12px 12px;opacity:0.5;z-index:0}.magic-seal-bg{position:absolute;top:-50%;right:-20%;width:80%;height:200%;background:repeating-conic-gradient(from 0deg,transparent 0deg 10deg,rgba(74,4,4,0.1) 10deg 20deg);border-radius:50%;animation:rotate-slow 120s linear infinite;z-index:0;opacity:0.3;filter:blur(1px)}.book-spine-left{position:absolute;top:0;left:0;width:12px;height:100%;background:linear-gradient(90deg,var(--dalian-black),var(--dalian-crimson),var(--dalian-black));box-shadow:2px 0 5px rgba(0,0,0,0.8);z-index:5}.book-spine-gold-line{position:absolute;top:0;left:10px;width:2px;height:100%;background:linear-gradient(to bottom,var(--dalian-gold) 10%,transparent 10%);background-size:100% 20px;z-index:6;opacity:0.6}/* === 正方形头像部分 === */.portrait-frame-square{position:absolute;top:20px;left:25px;width:120px;height:120px;/* 修改为正方形尺寸 */border:3px double var(--dalian-gold);box-shadow:0 5px 15px rgba(0,0,0,0.8);z-index:10;overflow:hidden;background:#000;transform:rotate(-2deg);border-radius:2px;transition:transform 0.3s}.portrait-frame-square:hover{transform:rotate(0deg) scale(1.05)}.portrait-inner{width:100%;height:100%;background-size:cover;background-position:center center;/* 图片居中 */filter:sepia(0.3) contrast(1.1);transition:background-image 0.5s ease}.frame-overlay{position:absolute;top:0;left:0;width:100%;height:100%;background:radial-gradient(circle,transparent 60%,rgba(0,0,0,0.6));/* 调整遮罩为径向以适应正方形 */box-shadow:inset 0 0 10px rgba(0,0,0,0.8);pointer-events:none}/* === 内容包裹 === */.content-wrapper{margin-left:140px;/* 稍微增加一点左边距 */position:relative;z-index:5}/* === 封印组件 === */.seal-complex{position:absolute;top:-20px;right:-20px;width:100px;height:100px;z-index:10;pointer-events:none}.lock-base{position:absolute;top:50%;left:50%;width:70px;height:70px;transform:translate(-50%,-50%);background:radial-gradient(circle,var(--dalian-black) 40%,var(--dalian-gold) 100%);border-radius:50%;border:3px double var(--dalian-gold);box-shadow:0 0 15px rgba(0,0,0,0.8);opacity:0.2;transition:opacity 0.5s}.phantom-library-container:hover .lock-base{opacity:1}.keyhole-glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:12px;height:20px;background:#000;clip-path:polygon(20% 0%,80% 0%,100% 100%,0% 100%);border-radius:50% 50% 0 0;box-shadow:0 0 10px var(--dalian-crimson);animation:pulse-red 4s ease-in-out infinite}.chain-cross{position:absolute;top:50%;left:50%;width:80px;height:80px;transform:translate(-50%,-50%);border:2px dashed var(--dalian-gold);border-radius:50%;animation:rotate-reverse 60s linear infinite;opacity:0.3}.page-float{position:absolute;background:var(--dalian-paper);width:15px;height:20px;opacity:0;box-shadow:0 2px 5px rgba(0,0,0,0.5);z-index:1}.p1{top:40%;right:10%;animation:page-fly 8s ease-in-out infinite}.p2{top:60%;right:30%;animation:page-fly 10s ease-in-out infinite 2s;width:10px;height:14px}.p3{top:20%;right:20%;animation:page-fly 7s ease-in-out infinite 4s;width:12px;height:16px}/* === 头部 === */.gothic-header{display:flex;align-items:center;position:relative;z-index:5;margin-bottom:8px;padding-right:60px;border-bottom:1px solid rgba(197,160,89,0.3)}.wax-seal{width:16px;height:16px;background:radial-gradient(circle at 30% 30%,#ff4d4d,#720e1e);border-radius:50%;box-shadow:1px 1px 3px rgba(0,0,0,0.6),inset -2px -2px 5px rgba(0,0,0,0.3);margin-right:10px;border:1px solid #300}.gothic-name{font-family:'UnifrakturMaguntia',cursive;font-size:1.4em;color:var(--dalian-gold);text-shadow:0 2px 4px rgba(0,0,0,0.8);letter-spacing:1px}.ornament-line{flex-grow:1;height:2px;background:linear-gradient(90deg,var(--dalian-crimson),transparent);margin-left:15px;opacity:0.7}/* === 内容 === */.page-body{position:relative;z-index:5;color:#ddd;font-size:1em;line-height:1.6;text-shadow:0 1px 2px rgba(0,0,0,0.9);white-space:pre-line}.page-body::first-letter{font-size:1.5em;color:var(--dalian-gold);font-family:'UnifrakturMaguntia',serif;float:left;margin-right:4px;line-height:1}@keyframes rotate-slow{100%{transform:rotate(360deg)}}@keyframes rotate-reverse{100%{transform:translate(-50%,-50%) rotate(-360deg)}}@keyframes pulse-red{0%,100%{box-shadow:0 0 5px var(--dalian-red)}50%{box-shadow:0 0 20px var(--dalian-red),0 0 10px #f00}}@keyframes page-fly{0%{opacity:0;transform:translate(0,0) rotate(0deg)}20%{opacity:0.8}80%{opacity:0.4}100%{opacity:0;transform:translate(-40px,-60px) rotate(-45deg)}}</style>",
            placement: [2], // 2代表并在聊天栏显示
            markdownOnly: true,
            runOnEdit: true
        },
        "奶龙": {
            scriptName: "Dynamic-奶龙美化",
            findRegex: "/<bubble>(.*?)<\\/bubble>/g",
            replaceString: "<div class='nailong-style'>$1</div><style>.nailong-style{color:gold;font-weight:bold;}</style>",
            placement: [2],
            markdownOnly: true,
            runOnEdit: true
        }
        // 你可以继续添加更多角色...
    };

    // 脚本管理的正则前缀标识
    const DYNAMIC_PREFIX = "Dynamic-";

    /**
     * 🔄 核心函数：根据当前角色更新正则
     */
    async function updateRegexForCurrentChar() {
        // 1. 获取当前角色名
        // SillyTavern.getContext().name2 通常是当前聊天角色的名字
        // 也可以用 TavernHelper.getCharData('current')?.name
        const context = SillyTavern.getContext();
        const charName = context.name2;

        if (!charName) return;

        console.log(`[DynamicRegex] 检测到角色: ${charName}`);

        // 2. 从仓库查找配置
        const targetConfig = REGEX_VAULT[charName];

        // 3. 获取当前所有正则列表
        const currentRegexes = TavernHelper.getTavernRegexes();

        // 4. 查找当前是否已存在由本脚本管理的动态正则
        const existingDynamicIndex = currentRegexes.findIndex(r => r.scriptName.startsWith(DYNAMIC_PREFIX));
        const existingDynamicRegex = existingDynamicIndex !== -1 ? currentRegexes[existingDynamicIndex] : null;

        // --- 策略 A: 目标角色在仓库中 ---
        if (targetConfig) {
            // 检查是否已经应用了该正则 (避免重复刷新)
            if (existingDynamicRegex && existingDynamicRegex.scriptName === targetConfig.scriptName) {
                console.log(`[DynamicRegex] 当前已是 ${charName} 的正则，跳过更新。`);
                return;
            }

            console.log(`[DynamicRegex] 正在应用 ${charName} 的专属正则...`);

            // 构造完整的正则对象 (补全缺失的默认字段)
            const newRegexEntry = {
                id: TavernHelper.builtin.uuidv4(),
                enabled: true,
                minDepth: null,
                maxDepth: null,
                substituteRegex: 0,
                trimStrings: [],
                promptOnly: false,
                ...targetConfig // 覆盖配置
            };

            // 如果存在旧的动态正则，直接替换；否则添加到末尾
            // 注意：为了稳定性，建议深拷贝数组操作
            const newRegexList = [...currentRegexes];

            if (existingDynamicIndex !== -1) {
                newRegexList[existingDynamicIndex] = newRegexEntry;
            } else {
                newRegexList.push(newRegexEntry);
            }

            // 执行替换 (这会触发聊天重载)
            await TavernHelper.replaceTavernRegexes(newRegexList);
            toastr.success(`已加载专属风格: ${charName}`);
        }

        // --- 策略 B: 目标角色不在仓库中 (恢复默认) ---
        else {
            if (existingDynamicRegex) {
                console.log(`[DynamicRegex] 角色无专属配置，移除动态正则。`);
                // 移除所有动态前缀的正则
                const newRegexList = currentRegexes.filter(r => !r.scriptName.startsWith(DYNAMIC_PREFIX));

                await TavernHelper.replaceTavernRegexes(newRegexList);
                toastr.info(`已恢复默认风格`);
            }
        }
    }

    // ==========================================
    // 🎧 事件监听
    // ==========================================

    // 监听聊天切换事件 (这是最主要的触发点)
    TavernHelper.eventOn(window.tavern_events.CHAT_CHANGED, async () => {
        //稍微延迟一下确保上下文更新
        setTimeout(updateRegexForCurrentChar, 500);
    });

    // 监听角色编辑事件 (可选，防止改名后没更新)
    TavernHelper.eventOn(window.tavern_events.CHARACTER_EDITED, () => {
        setTimeout(updateRegexForCurrentChar, 500);
    });

    // 脚本加载时立即检查一次
    updateRegexForCurrentChar();

    console.log("✅ 动态正则加载器已启动!");
})();
