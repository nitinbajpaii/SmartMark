import { Mail, Phone, MapPin, GraduationCap, BookOpen, UserCheck, Headphones } from 'lucide-react'

const contacts = [
  { icon: GraduationCap, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', title: 'Student Support', tag: 'Student', email: 'student@smartattendance.com' },
  { icon: BookOpen, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', title: 'Teacher Support', tag: 'Teacher', email: 'teacher@smartattendance.com' },
  { icon: UserCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', title: 'Mentor Support', tag: 'Mentor', email: 'mentor@smartattendance.com' },
  { icon: Headphones, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', title: 'Technical Support', tag: 'Support', email: 'support@smartattendance.com' },
]

export default function Contact() {
  return (
    <div className="page space-y-16">
      {/* Header */}
      <div className="space-y-4">
        <span className="badge badge-purple">Get In Touch</span>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Contact <span className="gradient-text">SmartMark</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl">
          We are here to help you. Contact us for support, questions, or feedback.
        </p>
      </div>

      {/* Contact cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contacts.map(({ icon: Icon, color, bg, title, tag, email }) => (
          <a
            key={title}
            href={`mailto:${email}`}
            className="glass-card p-6 space-y-4 hover:scale-[1.02] transition-all duration-300 hover:shadow-glow hover:border-white/20 group block"
          >
            <div className="flex items-start justify-between">
              <div className={`inline-flex p-3 rounded-xl border ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <span className="badge badge-gray">{tag}</span>
            </div>
            <div>
              <div className="font-semibold text-white mb-1">{title}</div>
              <div className="text-sm text-gray-400 group-hover:text-purple-300 transition-colors flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                {email}
              </div>
            </div>
          </a>
        ))}

        {/* Phone */}
        <a
          href="tel:+917651931926"
          className="glass-card p-6 space-y-4 hover:scale-[1.02] transition-all duration-300 hover:shadow-glow hover:border-white/20 group block"
        >
          <div className="inline-flex p-3 rounded-xl border bg-rose-500/10 border-rose-500/20">
            <Phone className="h-5 w-5 text-rose-400" />
          </div>
          <div>
            <div className="font-semibold text-white mb-1">Phone</div>
            <div className="text-sm text-gray-400 group-hover:text-purple-300 transition-colors flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 shrink-0" />
              +91 7651931926
            </div>
          </div>
        </a>

        {/* Location */}
        <div className="glass-card p-6 space-y-4">
          <div className="inline-flex p-3 rounded-xl border bg-cyan-500/10 border-cyan-500/20">
            <MapPin className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <div className="font-semibold text-white mb-1">Location</div>
            <div className="text-sm text-gray-400 flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              Punjab, India
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
