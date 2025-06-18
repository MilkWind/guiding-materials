import { getArticlesData } from "@/lib/mdx";
import { Remarkable } from 'remarkable';
import hljs from 'highlight.js';
import {getDictionary} from "@/get-dictionaries";
import CallToAction from "@/components/cta";
import React from "react";

export const generateMetadata = async ({ params }: any) => {
    const { content, frontmatter, readingTime } = getArticlesData(params.id, params.lang);
    const lang = await getDictionary(params.lang);
    return {
        title
: frontmatter.title + " | " + lang.blog.meta.title,
        description
: frontmatter.description,
        openGraph
: {
            title
: frontmatter.title + " | " + lang.blog.meta.title,
            type: "website",
            url
: ``,
            images
: [
                {
                    // 此处还可以有width和height属性，see:https://medium.com/@moh.mir36/open-graph-with-next-js-v13-app-directory-22c0049e2087
                    url
: "/logo.png",
                    alt
: ""
                }
            ],
            siteName
: "",
            description
: frontmatter.description,
            locale
: ""
        },
        twitter
: {
            images
: [
                {
                    url
: "/logo.png",
                    alt
: ""
                }
            ],
            title
: frontmatter.title + " | " + lang.blog.meta.title,
            description
: frontmatter.description,
            card
: "summary_large_image"
        },
    }
}
// !important：博客的排版需要在tailwind.config.js中添加插件：require("@tailwindcss/typography")，自行查看对应代码
const Page = async ({ params }: any) => {
    const { content, frontmatter, readingTime } = getArticlesData(params.id, params.lang);
    const md = new Remarkable({
        html
: true,
        breaks
: true,
        linkify
: true,
        typographer
: true,
        highlight: function (str: string, lang: string) {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return hljs.highlight(lang, str).value;
                } catch (err) {}
            }

            try {
                return hljs.highlightAuto(str).value;
            } catch (err) {

            }

            return ''; // use external default escaping
        }
    });
    const blog = md.render(content, frontmatter);
    const dictionary = await getDictionary(params.lang);

    return (
        <main className="container pb-24 text-start">
            <
div
                className
="prose dark:prose-invert prose-headings:mt-8 prose-headings:font-semibold prose-headings:text-black prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-lg dark:prose-headings:text-white w-screen p-4">
                <div dangerouslySetInnerHTML={{__html: blog}} className="prose-pre:p-4 dark:prose-pre:bg-gray-800 w-full p-4"/>
            </div>
            <CallToAction dictionary={dictionary} />
        </main>
    );
};
export default Page;