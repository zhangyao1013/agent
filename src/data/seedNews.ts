import type { NewsItem, VendorItem } from "../types";

/** 初始资讯来自公开报道检索，后续可由业务同学补充/覆盖 */
export const SEED_NEWS: NewsItem[] = [
  {
    id: "n1",
    app: "pdd",
    title: "拼多多「千亿扶持」延续，百亿补贴加码消费券与流量",
    summary:
      "平台三年拟投入超千亿资源，百亿补贴推出「100亿商家回馈计划」，通过消费券、加倍补等活动刺激订单增长，并下调部分类目保障金。",
    incentiveFocus: "商家侧：消费券反哺 + 推广服务费退返；用户侧：超级加倍补、降价补差等大促权益。",
    source: "新浪财经",
    sourceUrl: "https://finance.sina.com.cn/jjxw/2025-04-03/doc-inerwrzs8295666.shtml",
    date: "2025-04-03",
    region: "domestic",
  },
  {
    id: "n2",
    app: "pdd",
    title: "2026 618 招商：41 天大促 + 优惠联合营销流量加权",
    summary:
      "5/21–6/30 大促周期，开放大促作战室、智能报名；带大促标识商品需价保/降价补差，参与联合营销可获搜索推荐加权。",
    incentiveFocus: "联合营销：按消费者实得优惠向商家收取合作服务费；流量入口含主会场、搜索推荐、满减凑单。",
    source: "亿邦动力 / 新浪科技",
    sourceUrl: "https://finance.sina.com.cn/tech/roll/2026-05-11/doc-inhxnwmr9159190.shtml",
    date: "2026-05-11",
    region: "domestic",
  },
  {
    id: "n3",
    app: "ks-lite",
    title: "快手极速版任务体系：登录/看视频/签到/邀友/下单领金币",
    summary:
      "任务中心为核心增长入口，金币可兑换现金或礼券；邀友按被邀人第 1/2/7 天活跃分层奖励，存在每日挑战额外金币。",
    incentiveFocus: "C端激励闭环：看视频完播 + 邀友裂变 + 每日挑战；兑换比例约 10000:1 且随运营浮动。",
    source: "快手极速版活动规则页",
    sourceUrl: "https://kjmrbinzhou.e7a8k93pwi1at.com/doodle/QNILxtCw.html",
    date: "2025-12",
    region: "domestic",
  },
  {
    id: "n4",
    app: "kuaishou",
    title: "星火计划：小程序达人任务 CPM/CPS/线索分成",
    summary:
      "达人通过短视频/直播推广小程序，支持广告分成、收入分成、线索转化；高分成任务需预充值账户预算。",
    incentiveFocus: "B端增长：开发者发布任务 → 达人带货/带量；计费含按曝光、按支付、按线索。",
    source: "快手开放平台文档",
    sourceUrl:
      "https://open.kuaishou.com/docs/operate/reviewSpecification/sparkProject/sparkProject.html",
    date: "2025",
    region: "domestic",
  },
  {
    id: "n5",
    app: "hongguo",
    title: "红果短剧「边看边赚」：广告解锁 + 金币提现 + 抖音导流",
    summary:
      "免费短剧 + 现金/金币激励提升留存；QuestMobile 显示 2025 年 3 月月活约 1.73 亿，人均单日使用约 1.38 小时。",
    incentiveFocus: "看广告解锁剧集、签到/任务攒币提现；抖音切片一键跳转拉新；分账激励吸引创作者。",
    source: "腾讯新闻",
    sourceUrl: "https://news.qq.com/rain/a/20250612A08PYQ00",
    date: "2025-06-12",
    region: "domestic",
  },
  {
    id: "n6",
    app: "hongguo",
    title: "红果分账与内容激励：10 亿+ 播放量短剧、优质图文激励",
    summary:
      "上半年多部作品播放量破 10 亿；优质图文激励计划引导 UGC 分享剧情盘点，拉长时长应对增长放缓。",
    incentiveFocus: "创作者：高热新剧激励 + 分账；用户：图文/社区任务奖励，构建种草到看剧闭环。",
    source: "腾讯新闻 / 澎湃新闻",
    sourceUrl: "https://thepaper.cn/newsDetail_forward_31238427",
    date: "2025-07",
    region: "domestic",
  },
  {
    id: "n7",
    app: "overseas",
    title: "TikTok Rewards：邀友任务 + 积分兑现金/礼券",
    summary:
      "邀新用户 24 小时内填写邀请码可获得积分；部分市场邀友上限约 20 人/年，积分兑换率示例 10000 分 ≈ 1 澳元。",
    incentiveFocus: "海外裂变：Successful Invite Task + 周末任务；积分可换现金、优惠券、话费。",
    source: "TikTok 官方条款",
    sourceUrl:
      "https://sf16-draftcdn-sg.ibytedtos.com/obj/ies-hotsoon-draft-sg/tiktok/33269f41-8c3c-46c2-abe0-191708ae4fbc.html",
    date: "2025",
    region: "overseas",
  },
  {
    id: "n8",
    app: "overseas",
    title: "TikTok Lite / LIVE Fan Club：任务积分与创作者激励并行",
    summary:
      "部分地区 Lite 看片/邀友奖励；LIVE 粉丝团任务、Creator Rewards 分钟级内容变现构成多层激励。",
    incentiveFocus: "用户任务积分 + 直播等级权益 + 创作者 RPM 分成；欧盟曾对 Lite 激励做合规调整。",
    source: "Loyalty & Reward Co / TikTok Legal",
    sourceUrl: "https://loyaltyrewardco.com/have-you-been-invited-to-join-tiktok-rewards/",
    date: "2026-05",
    region: "overseas",
  },
];

export const SEED_VENDOR: VendorItem[] = [
  {
    id: "v1",
    vendor: "字节跳动",
    title: "红果与抖音流量协同加深",
    summary: "红果依托抖音 7 亿级 DAU 切片导流，短剧与图文社区并行探索商业化。",
    impact: "激励增长需关注跨端跳转链路、金币/分账规则变更。",
    date: "2025-08",
    sourceUrl: "https://news.qq.com/rain/a/20250806A0762B00",
  },
  {
    id: "v2",
    vendor: "拼多多",
    title: "商保会主导「千亿扶持」进入常态化",
    summary: "从百亿减免过渡到全面扶持商家拓单增收，电商西进、新质供给专项持续。",
    impact: "大促联合营销、消费券账单与开票规则影响商家参与意愿。",
    date: "2025-04",
    sourceUrl: "https://finance.sina.com.cn/jjxw/2025-04-03/doc-inerwrzs8295666.shtml",
  },
  {
    id: "v3",
    vendor: "快手",
    title: "小程序星火计划扩大行业覆盖",
    summary: "长视频、小说、工具、运营商等类目开放，分成与预充值机制并行。",
    impact: "激励 Widget / 任务中心可对标小程序任务与达人分佣模型。",
    date: "2025",
    sourceUrl:
      "https://open.kuaishou.com/docs/operate/reviewSpecification/sparkProject/sparkProject.html",
  },
];
