import { siteConfig } from "@/config/siteConfig";
import type { TrackDescriptor } from "@/types/musicConfig";
import { siteConfig } from "../config/siteConfig.ts";

// 音频 URL 必须包含站点部署前缀，兼容 /blog/ 和根目录部署。
const musicBase =
	`/${(siteConfig.base ?? "/").replace(/^\/+|\/+$/g, "")}/assets/music`.replace(
		/\/+/g,
		"/",
	);

/** 本地曲目：音频位于 public/assets/music，封面路径相对 src，时长单位为秒。 */
export const musicTracks: readonly TrackDescriptor[] = [
	{
		id: "mygo-1",
		title: "壱雫空",
		artist: "MyGO!!!!!",
		cover: "assets/images/music/mygo-1.jpg",
		source: `${musicBase}/mygo-1.flac`,
		duration: 192,
	},
	{
		id: "mygo-2",
		title: "影色舞",
		artist: "MyGO!!!!!",
		cover: "assets/images/music/mygo-2.jpg",
		source: `${musicBase}/mygo-2.flac`,
		duration: 212,
	},
	{
		id: "mygo-3",
		title: "春日影 (MyGO!!!!! ver.)",
		artist: "MyGO!!!!!",
		cover: "assets/images/music/mygo-3.jpg",
		source: `${musicBase}/mygo-3.flac`,
		duration: 258,
	},
	{
		id: "mygo-4",
		title: "焚音打",
		artist: "MyGO!!!!!",
		cover: "assets/images/music/mygo-4.jpg",
		source: `${musicBase}/mygo-4.flac`,
		duration: 245,
	},
	{
		id: "mygo-5",
		title: "迷星叫",
		artist: "MyGO!!!!!",
		cover: "assets/images/music/mygo-5.jpg",
		source: `${musicBase}/mygo-5.flac`,
		duration: 211,
	},
];
