import { Github, Linkedin, Mail, Twitter } from "lucide-react"

export default function Footer() {
    return (
        <footer className="bg-white border-t border-slate-100 pt-20 pb-12 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1 space-y-6">
                        <div className="text-2xl font-bold tracking-tight">WealthOS</div>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                            The professional-grade portfolio operating system for the disciplined investor.
                        </p>
                        <div className="flex items-center gap-4">
                            <a
                                href="#"
                                className="p-2 rounded-full bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                            >
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a
                                href="#"
                                className="p-2 rounded-full bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                            >
                                <Github className="w-4 h-4" />
                            </a>
                            <a
                                href="#"
                                className="p-2 rounded-full bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                            >
                                <Linkedin className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-900">Platform</h4>
                        <ul className="space-y-4 text-sm text-muted-foreground">
                            <li>
                                <a href="#features" className="hover:text-blue-600 transition-colors">
                                    Features
                                </a>
                            </li>
                            <li>
                                <a href="#philosophy" className="hover:text-blue-600 transition-colors">
                                    Philosophy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-blue-600 transition-colors">
                                    Security
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-blue-600 transition-colors">
                                    Integrations
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-900">Company</h4>
                        <ul className="space-y-4 text-sm text-muted-foreground">
                            <li>
                                <a href="#" className="hover:text-blue-600 transition-colors">
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-blue-600 transition-colors">
                                    Journal
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-blue-600 transition-colors">
                                    Careers
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-blue-600 transition-colors">
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-900">Newsletter</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Get weekly insights on long-term wealth building.
                        </p>
                        <div className="flex flex-col gap-2">
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                />
                            </div>
                            <button className="w-full py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-slate-900 transition-all cursor-pointer">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-xs text-muted-foreground">© 2026 WealthOS Technologies Inc. All rights reserved.</div>
                    <div className="flex gap-8 text-xs text-muted-foreground">
                        <a href="#" className="hover:text-slate-900 transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="hover:text-slate-900 transition-colors">
                            Terms of Service
                        </a>
                        <a href="#" className="hover:text-slate-900 transition-colors">
                            Cookie Policy
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
