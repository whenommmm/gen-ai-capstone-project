import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { i as Slot, s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as FileUp, c as Check, i as LoaderCircle, n as Upload, o as ChevronUp, r as RotateCcw, s as ChevronDown, t as X } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { a as SelectItemIndicator, c as SelectPortal, d as SelectSeparator$1, f as SelectTrigger$1, i as SelectItem$1, l as SelectScrollDownButton$1, m as SelectViewport, n as SelectContent$1, o as SelectItemText, p as SelectValue$1, r as SelectIcon, s as SelectLabel$1, t as Select$1, u as SelectScrollUpButton$1 } from "../_libs/@radix-ui/react-select+[...].mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/radix-ui__react-slider.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Bs-KRH3s.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
var Slider = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
	ref,
	className: cn("relative flex w-full touch-none select-none items-center", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
		className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full bg-primary" })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" })]
}));
Slider.displayName = Slider$1.displayName;
var Select = Select$1;
var SelectValue = SelectValue$1;
var SelectTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
	ref,
	className: cn("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 opacity-50" })
	})]
}));
SelectTrigger.displayName = SelectTrigger$1.displayName;
var SelectScrollUpButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4" })
}));
SelectScrollUpButton.displayName = SelectScrollUpButton$1.displayName;
var SelectScrollDownButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" })
}));
SelectScrollDownButton.displayName = SelectScrollDownButton$1.displayName;
var SelectContent = import_react.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent$1, {
	ref,
	className: cn("relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
	position,
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewport, {
			className: cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton, {})
	]
}) }));
SelectContent.displayName = SelectContent$1.displayName;
var SelectLabel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectLabel$1, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", className),
	...props
}));
SelectLabel.displayName = SelectLabel$1.displayName;
var SelectItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
	ref,
	className: cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, { children })]
}));
SelectItem.displayName = SelectItem$1.displayName;
var SelectSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectSeparator$1, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
SelectSeparator.displayName = SelectSeparator$1.displayName;
var API_BASE_URL = "http://localhost:8000";
async function handle(res) {
	if (!res.ok) {
		let msg = `${res.status} ${res.statusText}`;
		try {
			const data = await res.json();
			if (data?.detail) msg = typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail);
			else if (data?.error) msg = data.error;
		} catch {}
		throw new Error(msg);
	}
	return res.json();
}
var api = {
	async health() {
		return handle(await fetch(`${API_BASE_URL}/api/health`));
	},
	async sampleBriefs() {
		return handle(await fetch(`${API_BASE_URL}/api/sample-briefs`));
	},
	async extractText(file) {
		const fd = new FormData();
		fd.append("file", file);
		return handle(await fetch(`${API_BASE_URL}/api/extract-text`, {
			method: "POST",
			body: fd
		}));
	},
	async parseJD(jd_text) {
		return handle(await fetch(`${API_BASE_URL}/api/parse-jd`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ jd_text })
		}));
	},
	async rank(opts) {
		const fd = new FormData();
		fd.append("jd", JSON.stringify(opts.jd));
		fd.append("shortlist_size", String(opts.shortlist_size));
		fd.append("use_samples", opts.use_samples ? "true" : "false");
		if (!opts.use_samples) for (const f of opts.files) fd.append("files", f);
		return handle(await fetch(`${API_BASE_URL}/api/rank`, {
			method: "POST",
			body: fd
		}));
	},
	async bias(results, shortlist_size) {
		return handle(await fetch(`${API_BASE_URL}/api/bias`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				results,
				shortlist_size
			})
		}));
	},
	async regenerateQuestions(jd, candidate, n = 5) {
		return handle(await fetch(`${API_BASE_URL}/api/regenerate-questions`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				jd,
				candidate,
				n
			})
		}));
	}
};
function Eyebrow({ number, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-4 mb-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-signal text-sm tracking-[0.2em]",
				children: number
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-mist text-xs tracking-[0.2em] uppercase whitespace-nowrap",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1 h-px bg-line" })
		]
	});
}
function Stat({ value, label, amber = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-panel border border-line rounded-[10px] px-4 py-3 min-w-0 flex-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("font-mono font-bold text-[22px] leading-tight truncate", amber ? "text-signal" : "text-text"),
			title: String(value),
			children: value
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "font-mono uppercase tracking-[0.2em] text-[10px] text-mist mt-1",
			children: label
		})]
	});
}
function Chip({ children, variant = "amber" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center font-mono text-[11px] uppercase tracking-[0.12em] px-2.5 py-1 rounded-full border", variant === "amber" ? "border-signal/60 text-signal" : "border-line text-mist"),
		children
	});
}
function Spinner({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: cn("animate-spin", className) });
}
function Meter({ label, value, index }) {
	const pct = Math.max(0, Math.min(100, value));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono uppercase text-[10px] tracking-[0.2em] text-mist w-12 shrink-0",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 h-[7px] bg-line rounded-full overflow-hidden min-w-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "meter-fill h-full rounded-full",
					style: {
						width: `${pct}%`,
						animationDelay: `${index * 90}ms`,
						background: "linear-gradient(90deg, #F2A93B 0%, #ffc972 100%)"
					}
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-[12px] text-text w-8 text-right shrink-0",
				children: String(Math.round(pct)).padStart(2, "0")
			})
		]
	});
}
function CandidateCard({ c, rank }) {
	const meters = [
		{
			label: "HARD",
			value: c.breakdown.hard_skills
		},
		{
			label: "EXP",
			value: c.breakdown.experience
		},
		{
			label: "SOFT",
			value: c.breakdown.soft_skills
		},
		{
			label: "DOMAIN",
			value: c.breakdown.domain
		}
	];
	const subline = [
		c.profile.current_title,
		...c.profile.companies.slice(0, 2),
		`${c.profile.years_experience} yrs`
	].filter(Boolean).join(" · ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "bg-panel border border-line rounded-[14px] p-5 md:p-6 transition-colors duration-200 hover:border-signal",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-start gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-signal border border-signal/60 rounded-md px-2 py-1 text-sm shrink-0",
						children: String(rank).padStart(2, "0")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 flex-wrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display font-semibold text-[19px] text-text leading-tight",
								children: c.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { children: c.profile.background_type })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-mist text-[12.5px] mt-1 font-sans",
							children: subline
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono font-bold text-signal text-[34px] leading-none",
							children: Math.round(c.overall_score)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono uppercase tracking-[0.2em] text-[10px] text-mist mt-1",
							children: "match"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 mt-5",
				children: meters.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
					label: m.label,
					value: m.value,
					index: i
				}, m.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 text-text border-l-2 border-signal pl-4 text-[14px] leading-relaxed",
				children: c.fit_summary
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 md:grid-cols-2 gap-6 mt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-mono uppercase tracking-[0.2em] text-[10px] text-mist mb-2",
					children: "Gaps"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-1.5 text-[13.5px] text-text",
					children: c.gaps.map((g, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-mist",
							children: "—"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: g })]
					}, i))
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-mono uppercase tracking-[0.2em] text-[10px] text-mist mb-2",
					children: "Probe in interview"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-1.5 text-[13.5px] text-text",
					children: c.probe_in_interview.map((g, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-mist",
							children: "—"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: g })]
					}, i))
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-mono uppercase tracking-[0.2em] text-[10px] text-mist mb-2",
					children: "Interview signal"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-1.5 text-[13.5px] text-text",
					children: c.interview_questions.map((q, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-signal font-mono text-[11px] mt-0.5",
							children: String(i + 1).padStart(2, "0")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: q })]
					}, i))
				})]
			})
		]
	});
}
function NoiseRow({ c, rank }) {
	const pct = Math.max(0, Math.min(100, c.overall_score));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-4 bg-panel/50 border border-line rounded-[10px] px-4 py-2.5 opacity-[0.82] hover:opacity-100 transition-opacity",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-mist text-[12px] w-8 shrink-0",
				children: String(rank).padStart(2, "0")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 min-w-0 truncate text-[13px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-text",
					children: c.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-mist",
					children: [" — ", c.profile.current_title]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-[5px] w-[120px] bg-line rounded-full overflow-hidden shrink-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full bg-signal",
					style: { width: `${pct}%` }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-[12px] text-text w-8 text-right shrink-0",
				children: String(Math.round(pct)).padStart(2, "0")
			})
		]
	});
}
function BiasPanel({ b }) {
	const color = b.is_homogeneous ? "warn" : "good";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("border rounded-[14px] p-5 md:p-6 bg-panel", color === "warn" ? "border-warn" : "border-good"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: cn("font-display font-semibold text-[20px] leading-tight", color === "warn" ? "text-warn" : "text-good"),
				children: b.is_homogeneous ? `Shortlist looks homogeneous — homogeneity ${b.homogeneity_score}/100` : `Shortlist looks balanced — homogeneity ${b.homogeneity_score}/100`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Patterns detected",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-1.5",
					children: b.patterns.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-2 text-[13.5px] text-text",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-mist",
							children: "—"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p })]
					}, i))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Strong candidates you may be overlooking",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-1.5",
					children: b.overlooked_candidates.map((o, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-2 text-[13.5px] text-text",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-mist",
							children: "—"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display font-semibold",
								children: o.name
							}),
							" — ",
							o.reason
						] })]
					}, i))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Recommendations",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-1.5",
					children: b.recommendations.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-2 text-[13.5px] text-text",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-mist",
							children: "—"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: r })]
					}, i))
				})
			})
		]
	});
}
function Section({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "font-mono uppercase tracking-[0.2em] text-[10px] text-mist mb-2",
			children: title
		}), children]
	});
}
function SignalPage() {
	const [health, setHealth] = (0, import_react.useState)(null);
	const [healthErr, setHealthErr] = (0, import_react.useState)(false);
	const [shortlistSize, setShortlistSize] = (0, import_react.useState)(10);
	const [briefs, setBriefs] = (0, import_react.useState)([]);
	const [briefId, setBriefId] = (0, import_react.useState)("");
	const [jdText, setJdText] = (0, import_react.useState)("");
	const [parsing, setParsing] = (0, import_react.useState)(false);
	const [jd, setJd] = (0, import_react.useState)(null);
	const [jdFileLoading, setJdFileLoading] = (0, import_react.useState)(false);
	const jdFileInputRef = (0, import_react.useRef)(null);
	const [files, setFiles] = (0, import_react.useState)([]);
	const [useSamples, setUseSamples] = (0, import_react.useState)(false);
	const [dragOver, setDragOver] = (0, import_react.useState)(false);
	const fileInputRef = (0, import_react.useRef)(null);
	const [ranking, setRanking] = (0, import_react.useState)(false);
	const [rank, setRank] = (0, import_react.useState)(null);
	const [bias, setBias] = (0, import_react.useState)(null);
	const [auditing, setAuditing] = (0, import_react.useState)(false);
	const [regenName, setRegenName] = (0, import_react.useState)("");
	const [regenerating, setRegenerating] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		api.health().then((h) => setHealth(h)).catch(() => setHealthErr(true));
		api.sampleBriefs().then((r) => setBriefs(r.briefs)).catch(() => {});
	}, []);
	const totalInPile = useSamples ? 20 : files.length;
	const canRun = !!jd && (useSamples || files.length > 0);
	const shortlist = (0, import_react.useMemo)(() => rank ? rank.results.slice(0, shortlistSize) : [], [rank, shortlistSize]);
	const belowCut = (0, import_react.useMemo)(() => rank ? rank.results.slice(shortlistSize) : [], [rank, shortlistSize]);
	(0, import_react.useEffect)(() => {
		if (shortlist.length && !shortlist.find((c) => c.name === regenName)) setRegenName(shortlist[0]?.name ?? "");
	}, [shortlist, regenName]);
	async function handleParse() {
		if (!jdText.trim()) return;
		setParsing(true);
		try {
			setJd(await api.parseJD(jdText));
		} catch (e) {
			toast.error(errMsg(e, "Couldn't parse the role."));
		} finally {
			setParsing(false);
		}
	}
	function handleLoadBrief() {
		const b = briefs.find((x) => x.id === briefId);
		if (!b) {
			toast.error("Pick a sample brief first.");
			return;
		}
		setJdText(b.text);
	}
	async function handleJdFile(list) {
		const f = list?.[0];
		if (!f) return;
		if (![
			".pdf",
			".docx",
			".txt"
		].some((ext) => f.name.toLowerCase().endsWith(ext))) {
			toast.error(`${f.name} isn't supported — use PDF, DOCX, or TXT.`);
			return;
		}
		setJdFileLoading(true);
		try {
			const { text } = await api.extractText(f);
			setJdText(text);
			toast.success(`Loaded ${f.name} — review it, then parse the role.`);
		} catch (e) {
			toast.error(errMsg(e, "Couldn't read that file."));
		} finally {
			setJdFileLoading(false);
		}
	}
	function handleFiles(list) {
		if (!list) return;
		const allowed = [
			".pdf",
			".docx",
			".txt"
		];
		const next = [];
		for (const f of Array.from(list)) {
			if (!allowed.some((ext) => f.name.toLowerCase().endsWith(ext))) {
				toast.error(`${f.name} isn't supported — use PDF, DOCX, or TXT.`);
				continue;
			}
			next.push(f);
		}
		setFiles((prev) => [...prev, ...next]);
	}
	async function handleRank() {
		if (!jd) return;
		setRanking(true);
		setBias(null);
		try {
			setRank(await api.rank({
				jd,
				shortlist_size: shortlistSize,
				use_samples: useSamples,
				files
			}));
		} catch (e) {
			toast.error(errMsg(e, "Couldn't reach the API. Is the backend running on http://localhost:8000?"));
		} finally {
			setRanking(false);
		}
	}
	async function handleBias() {
		if (!rank) return;
		setAuditing(true);
		try {
			setBias(await api.bias(rank.results, shortlistSize));
		} catch (e) {
			toast.error(errMsg(e, "Couldn't audit the shortlist."));
		} finally {
			setAuditing(false);
		}
	}
	async function handleRegenerate() {
		if (!jd || !rank || !regenName) return;
		const target = rank.results.find((c) => c.name === regenName);
		if (!target) return;
		setRegenerating(true);
		try {
			const { interview_questions } = await api.regenerateQuestions(jd, target, 5);
			setRank({
				...rank,
				results: rank.results.map((c) => c.name === regenName ? {
					...c,
					interview_questions
				} : c)
			});
			toast.success("Fresh questions generated.");
		} catch (e) {
			toast.error(errMsg(e, "Couldn't regenerate questions."));
		} finally {
			setRegenerating(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen text-text",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1280px] px-4 md:px-8 py-6 md:py-10 lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "mb-8 lg:mb-0 lg:sticky lg:top-8 lg:self-start",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-panel/40 border border-line rounded-[12px] p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-signal text-[11px] tracking-[0.2em] uppercase",
							children: "◉ Control"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-mono uppercase tracking-[0.2em] text-[10px] text-mist",
								children: "Model"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-2 w-2 rounded-full shrink-0", healthErr ? "bg-warn" : health ? "bg-signal signal-pulse" : "bg-mist") }), healthErr ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[12px] text-warn",
									children: "API unreachable"
								}) : health ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[11px] text-signal border border-signal/40 rounded px-2 py-0.5 truncate",
									children: health.model
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[12px] text-mist",
									children: "Connecting…"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-mono uppercase tracking-[0.2em] text-[10px] text-mist block mb-2",
									children: "Shortlist size — the signal cut"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
										value: [shortlistSize],
										min: 1,
										max: 20,
										step: 1,
										onValueChange: (v) => setShortlistSize(v[0] ?? 10),
										className: "flex-1"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-signal text-[14px] w-6 text-right",
										children: shortlistSize
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11.5px] text-mist mt-2 leading-snug",
									children: "Everyone below the cut drops to the noise floor."
								})
							]
						})
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "relative border-t-2 border-signal pt-8 pb-10 overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0 pointer-events-none opacity-100",
							style: { backgroundImage: "repeating-linear-gradient(to bottom, rgba(242,169,59,0.04) 0px, rgba(242,169,59,0.04) 1px, transparent 1px, transparent 5px)" }
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 font-mono text-signal text-[11px] tracking-[0.2em] uppercase",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-signal signal-pulse" }), "Signal · Talent Analyzer"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
									className: "font-display font-bold text-[36px] md:text-[42px] leading-[1.05] tracking-[-0.02em] mt-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-text",
											children: "Surface the signal."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-signal",
											children: "Explain the call."
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-mist mt-4 max-w-[46ch] text-[14.5px] leading-relaxed",
									children: "Screen the whole pile. Hear the few candidates who matter through the noise — scored on meaning, not keywords, with every judgement on the record."
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, {
								number: "01",
								label: "Source · The role"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 md:grid-cols-5 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "md:col-span-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										value: jdText,
										onChange: (e) => setJdText(e.target.value),
										placeholder: "Paste a job description, or load a sample brief →",
										className: "bg-panel border-line text-text placeholder:text-mist/60 min-h-[190px] resize-y rounded-[10px] focus-visible:border-signal focus-visible:ring-signal/30"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "md:col-span-2 flex flex-col gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-mono uppercase tracking-[0.2em] text-[10px] text-mist mb-2",
											children: "Sample brief"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: briefId,
											onValueChange: setBriefId,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "bg-panel border-line text-text rounded-[10px] h-11 focus:border-signal focus:ring-signal/30",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Choose a brief…" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
												className: "bg-panel border-line text-text",
												children: briefs.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: b.id,
													children: b.label
												}, b.id))
											})]
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "secondary",
											onClick: handleLoadBrief,
											className: "bg-panel-2 hover:bg-panel-2/80 border border-line text-text rounded-[10px] h-11",
											children: "Load this brief"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3 my-0.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1 h-px bg-line" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono uppercase tracking-[0.2em] text-[10px] text-mist",
													children: "or"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1 h-px bg-line" })
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											ref: jdFileInputRef,
											type: "file",
											accept: ".pdf,.docx,.txt",
											className: "hidden",
											onChange: (e) => {
												handleJdFile(e.target.files);
												e.target.value = "";
											}
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "secondary",
											onClick: () => jdFileInputRef.current?.click(),
											disabled: jdFileLoading,
											className: "bg-panel-2 hover:bg-panel-2/80 border border-line text-text rounded-[10px] h-11",
											children: jdFileLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { className: "h-4 w-4" }), " Reading…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUp, { className: "h-4 w-4" }), " Upload JD file"] })
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: handleParse,
									disabled: !jdText.trim() || parsing,
									className: "bg-signal text-[#1a1206] hover:bg-signal/90 rounded-[10px] h-11 px-6 font-medium",
									children: parsing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { className: "h-4 w-4" }), " Parsing…"] }) : "Parse the role"
								})
							}),
							jd && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 space-y-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 md:grid-cols-4 gap-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
												value: jd.title,
												label: "role",
												amber: true
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
												value: jd.experience_level,
												label: "level"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
												value: jd.must_have.length,
												label: "must-haves"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
												value: jd.hard_skills.length,
												label: "hard skills"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 md:grid-cols-2 gap-6 bg-panel border border-line rounded-[12px] p-5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-mono uppercase tracking-[0.2em] text-[10px] text-mist mb-2",
											children: "Must-have"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
											className: "space-y-1.5 text-[13.5px]",
											children: jd.must_have.map((x, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
												className: "flex gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-mist",
													children: "—"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: x })]
											}, i))
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-mono uppercase tracking-[0.2em] text-[10px] text-mist mb-2",
											children: "Nice-to-have"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
											className: "space-y-1.5 text-[13.5px]",
											children: jd.nice_to_have.map((x, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
												className: "flex gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-mist",
													children: "—"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: x })]
											}, i))
										})] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex flex-wrap gap-2",
											children: jd.hard_skills.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
												variant: "amber",
												children: s
											}, s))
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex flex-wrap gap-2",
											children: jd.soft_skills.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
												variant: "muted",
												children: s
											}, s))
										})]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-12",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, {
								number: "02",
								label: "Intake · The pile"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 md:grid-cols-5 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "md:col-span-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										onDragOver: (e) => {
											e.preventDefault();
											setDragOver(true);
										},
										onDragLeave: () => setDragOver(false),
										onDrop: (e) => {
											e.preventDefault();
											setDragOver(false);
											handleFiles(e.dataTransfer.files);
										},
										className: cn("bg-panel border-2 border-dashed rounded-[12px] p-6 text-center transition-colors cursor-pointer", dragOver ? "border-signal" : "border-line hover:border-signal/60"),
										onClick: () => fileInputRef.current?.click(),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												ref: fileInputRef,
												type: "file",
												multiple: true,
												accept: ".pdf,.docx,.txt",
												className: "hidden",
												onChange: (e) => {
													handleFiles(e.target.files);
													e.target.value = "";
												}
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-6 w-6 text-signal mx-auto mb-2" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[14px] text-text",
												children: "Drop CVs here, or click to browse"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-mono uppercase tracking-[0.2em] text-[10px] text-mist mt-2",
												children: "Upload CVs (PDF / DOCX / TXT) — batch upload supported"
											})
										]
									}), files.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "mt-3 space-y-1.5",
										children: files.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-center gap-3 bg-panel border border-line rounded-[8px] px-3 py-2 text-[13px]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "flex-1 truncate",
												children: f.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setFiles((prev) => prev.filter((_, j) => j !== i)),
												className: "text-mist hover:text-warn",
												"aria-label": `Remove ${f.name}`,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
											})]
										}, i))
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "md:col-span-2 flex flex-col gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										onClick: () => setUseSamples((v) => !v),
										className: cn("rounded-[10px] h-11 border", useSamples ? "bg-signal/10 border-signal text-signal hover:bg-signal/20" : "bg-panel-2 border-line text-text hover:bg-panel-2/80"),
										children: "Use 20 sample candidates"
									}), useSamples && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[12px] text-mist",
										children: "20 bundled sample CVs will be analyzed."
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 grid grid-cols-2 md:grid-cols-4 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									value: totalInPile,
									label: "CVs in the pile",
									amber: true
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									value: "local",
									label: "parsed without api"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-12",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, {
								number: "03",
								label: "Analysis · The signal"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: handleRank,
								disabled: !canRun || ranking,
								className: "bg-signal text-[#1a1206] hover:bg-signal/90 rounded-[10px] h-11 px-6 font-medium",
								children: ranking ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { className: "h-4 w-4" }), " Scoring…"] }) : "Run analysis"
							}),
							!canRun && !ranking && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[12.5px] text-mist mt-2",
								children: "Parse a role and load some CVs to run the analysis."
							}),
							ranking && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 bg-panel border border-line rounded-[12px] p-6 flex items-center gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { className: "h-5 w-5 text-signal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[14px]",
									children: [
										"Scoring ",
										totalInPile,
										" candidates against the role…"
									]
								})]
							}),
							rank && !ranking && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 space-y-8",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 md:grid-cols-4 gap-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
												value: rank.count,
												label: "screened"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
												value: Math.min(shortlistSize, rank.count),
												label: "surfaced",
												amber: true
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
												value: `${Math.round(rank.elapsed_seconds)}s`,
												label: rank.elapsed_seconds < 60 ? "under 60s ✓" : "elapsed"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
												value: rank.api_calls,
												label: "api calls"
											})
										]
									}),
									rank.errors.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "border border-signal/40 bg-signal/5 rounded-[10px] p-3 text-[12.5px] text-signal",
										children: [
											rank.errors.length,
											" file",
											rank.errors.length === 1 ? "" : "s",
											" failed to parse:",
											" ",
											rank.errors.map((e) => e.file).join(", ")
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-mono uppercase tracking-[0.2em] text-[11px] text-signal mb-4",
										children: "· Signal — the shortlist"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-4",
										children: shortlist.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CandidateCard, {
											c,
											rank: i + 1
										}, c.name + i))
									})] }),
									shortlist.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 md:grid-cols-5 gap-3 items-end",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "md:col-span-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-mono uppercase tracking-[0.2em] text-[10px] text-mist mb-2",
												children: "Regenerate interview questions for"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: regenName,
												onValueChange: setRegenName,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													className: "bg-panel border-line rounded-[10px] h-11 focus:border-signal",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
													className: "bg-panel border-line",
													children: shortlist.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
														value: c.name,
														children: [
															"#",
															i + 1,
															" ",
															c.name
														]
													}, c.name + i))
												})]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "md:col-span-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "secondary",
												onClick: handleRegenerate,
												disabled: regenerating || !regenName,
												className: "bg-panel-2 hover:bg-panel-2/80 border border-line text-text rounded-[10px] h-11 w-full",
												children: regenerating ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { className: "h-4 w-4" }), " Regenerating…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-4 w-4" }), " Regenerate questions"] })
											})
										})]
									}),
									belowCut.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-4 mb-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-mono uppercase tracking-[0.2em] text-[10px] text-mist whitespace-nowrap",
											children: [
												"Noise floor · ",
												belowCut.length,
												" below the cut"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1 border-t border-dashed border-line" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-2",
										children: belowCut.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NoiseRow, {
											c,
											rank: shortlistSize + i + 1
										}, c.name + i))
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, {
											number: "·",
											label: "Diversity scan"
										}),
										!bias && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											onClick: handleBias,
											disabled: auditing,
											className: "bg-signal text-[#1a1206] hover:bg-signal/90 rounded-[10px] h-11 px-6 font-medium",
											children: auditing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { className: "h-4 w-4" }), " Auditing…"] }) : "Audit the shortlist for bias"
										}),
										bias && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BiasPanel, { b: bias })
									] })
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
						className: "mt-16 pb-10 border-t border-line pt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-mono uppercase tracking-[0.2em] text-[10px] text-mist",
							children: ["Signal · Talent Analyzer — front-end · ", API_DISPLAY()]
						})
					})
				]
			})]
		})
	});
}
function API_DISPLAY() {
	return "http://localhost:8000";
}
function errMsg(e, fallback) {
	if (e instanceof TypeError) return fallback;
	if (e instanceof Error && e.message) return e.message;
	return fallback;
}
//#endregion
export { SignalPage as component };
