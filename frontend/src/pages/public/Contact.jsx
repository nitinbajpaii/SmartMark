export default function Contact() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20 pb-20 space-y-12">
      <div className="space-y-3">
        <h1 className="text-4xl md:text-5xl font-bold">Contact SmartMark</h1>
        <p className="text-lg text-gray-300 max-w-3xl">
          We are here to help you. Contact us for support, questions, or feedback.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { title: 'Student Support', tag: 'Student', email: 'student@smartattendance.com' },
          { title: 'Teacher Support', tag: 'Teacher', email: 'teacher@smartattendance.com' },
          { title: 'Mentor Support', tag: 'Mentor', email: 'mentor@smartattendance.com' },
          { title: 'Technical Support', tag: 'Support', email: 'support@smartattendance.com' },
        ].map((c) => (
          <div key={c.title} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="text-lg font-medium">{c.title}</div>
              <span className="text-xs px-2 py-1 rounded-lg bg-white/10 border border-white/20">{c.tag}</span>
            </div>
            <div className="text-gray-300 mt-2">{c.email}</div>
          </div>
        ))}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300">
          <div className="text-lg font-medium">Phone</div>
          <div className="text-gray-300 mt-2">+91 7088041390</div>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300">
          <div className="text-lg font-medium">Location</div>
          <div className="text-gray-300 mt-2">Punjab, India</div>
        </div>
      </div>
    </div>
  )
}
