import{k as d,p as e,e as p}from"./index-CPw5_9PW.js";import{r as o}from"./vendor-BZ5EeRDG.js";import{M as y}from"./ModuleLayout-ChTY61gm.js";import{G as t}from"./GlassCard-CR0AryKl.js";import{B as v}from"./Button-AhuAHBnc.js";import{I as j}from"./Input-DFg2i99H.js";import{T as b}from"./Textarea-BgkKBZ-c.js";import{S as w}from"./Select-OvICsODg.js";import{h as N}from"./api-C_9nXFii.js";import"./redux-B5Sh6uDB.js";import"./firebase-CpcTUk9y.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S=[["path",{d:"M7.9 20A9 9 0 1 0 4 16.1L2 22Z",key:"vv11sd"}]],k=d("MessageCircle",S);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]],M=d("Send",C);function E(){const[l,u]=o.useState("email"),[r,m]=o.useState(""),[n,h]=o.useState(""),[s,i]=o.useState(null),[x,c]=o.useState(!1),g=async()=>{c(!0);try{const a=await N({type:l,target:r,context:n});i(a)}catch{i({initial:l==="email"?`Subject: Partnership Opportunity with [Your Brand]

Hi ${r||"{{name}}"},

I came across your profile and was impressed by your content in [niche]. We believe a collaboration could benefit both our audiences...

Best regards,
[Your Name]`:`Hi ${r||"{{name}}"}! 👋

I love your content about [topic]. We're launching something that your audience would find valuable. Would you be open to a quick chat?`,followUps:["Follow-up 1 (Day 3): Just checking in on my previous message...","Follow-up 2 (Day 7): Sharing a case study from a similar collaboration...","Follow-up 3 (Day 14): Final follow-up with exclusive offer..."],sponsorship:`Sponsorship Proposal:

Brand: [Your Brand]
Deliverables: 3 Instagram posts + 2 Stories
Compensation: $X + Free products
Timeline: 2 weeks
Exclusivity: Category exclusivity for 30 days`,tracking:{opens:0,clicks:0,replies:0,status:"draft"}})}finally{c(!1)}};return e.jsx(y,{title:"AI Outreach Automation",description:"Generate personalized cold emails, WhatsApp messages, and follow-up sequences",actions:e.jsxs(v,{onClick:g,loading:x,children:[e.jsx(M,{size:18})," Generate Outreach"]}),children:e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-6",children:[e.jsx(t,{hover:!1,children:e.jsxs("div",{className:"space-y-4",children:[e.jsx(w,{label:"Outreach Type",options:[{value:"email",label:"Cold Email"},{value:"whatsapp",label:"WhatsApp Message"},{value:"sponsorship",label:"Sponsorship Proposal"},{value:"followup",label:"Follow-up Sequence"}],value:l,onChange:a=>u(a.target.value)}),e.jsx(j,{label:"Target Name / Company",value:r,onChange:a=>m(a.target.value),placeholder:"John Doe / Acme Corp"}),e.jsx(b,{label:"Context",value:n,onChange:a=>h(a.target.value),placeholder:"Additional context about the target or your offer..."})]})}),e.jsx("div",{className:"lg:col-span-2 space-y-4",children:s?e.jsxs(e.Fragment,{children:[e.jsxs(t,{hover:!1,children:[e.jsxs("div",{className:"flex items-center gap-2 mb-3",children:[l==="whatsapp"?e.jsx(k,{size:18}):e.jsx(p,{size:18}),e.jsx("h4",{className:"font-semibold",children:"Initial Message"})]}),e.jsx("pre",{className:"text-sm whitespace-pre-wrap",style:{color:"var(--text-secondary)"},children:s.initial})]}),s.followUps&&e.jsxs(t,{hover:!1,children:[e.jsx("h4",{className:"font-semibold mb-3",children:"Follow-up Sequence"}),s.followUps.map((a,f)=>e.jsx("div",{className:"p-3 rounded-xl mb-2 text-sm",style:{background:"var(--bg-secondary)"},children:a},f))]}),s.tracking&&e.jsxs("div",{className:"grid grid-cols-4 gap-3",children:[["opens","clicks","replies"].map(a=>e.jsxs(t,{className:"text-center !p-3",children:[e.jsx("p",{className:"text-xl font-bold",children:s.tracking[a]}),e.jsx("p",{className:"text-xs capitalize",style:{color:"var(--text-muted)"},children:a})]},a)),e.jsxs(t,{className:"text-center !p-3",children:[e.jsx("span",{className:"badge badge-warning",children:s.tracking.status}),e.jsx("p",{className:"text-xs mt-1",style:{color:"var(--text-muted)"},children:"Status"})]})]})]}):e.jsxs(t,{hover:!1,className:"text-center py-20",children:[e.jsx(p,{size:48,className:"mx-auto mb-4 opacity-30"}),e.jsx("p",{style:{color:"var(--text-muted)"},children:"Configure outreach settings and generate personalized messages"})]})})]})})}export{E as default};
