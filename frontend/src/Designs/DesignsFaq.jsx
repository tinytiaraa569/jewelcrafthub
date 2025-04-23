import React from 'react'
import { motion } from 'framer-motion'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  UserPlus,
  DollarSign,
  ShieldCheck,
  HelpCircle,
  FileText,
  UploadCloud,
  ClipboardCheck,
  Clock,
  Banknote,
  Lock,
  AlertCircle,
} from 'lucide-react'

const iconMap = [
  UserPlus,
  DollarSign,
  ShieldCheck,
  HelpCircle,
  FileText,
  UploadCloud,
  ClipboardCheck,
  Clock,
  Banknote,
  Lock,
  AlertCircle,
]

const DesignsFaq = () => {
  const faqitems = [
    {
      title: 'Who can sign up as a designer on this platform?',
      desc:
        'Anyone with jewelry design skills — from students and freelancers to experienced artists — can sign up. Manual sketch artists, CAD designers, and illustrators are all welcome.',
    },
    {
      title: 'Do I get paid for every design I submit?',
      desc:
        'Only selected designs are paid for. Each brief will mention if compensation is provided for submissions or only for selected entries.',
    },
    {
      title: 'How are design copyrights handled?',
      desc:
        'Your design remains your intellectual property until it is selected and paid for. Once selected, the rights transfer to the brand that commissioned the brief. This ensures fair recognition and protection for both parties.',
    },
    {
      title: 'What if my design is not selected?',
      desc:
        'Unselected designs remain your property and can be reused or submitted elsewhere unless the brief states otherwise.',
    },
    {
      title: 'What are the file formats accepted for design uploads?',
      desc:
        'We accept high-resolution JPG, PNG, and PDF files for manual sketches.',
    },
    {
      title: 'Is there any fee to join or submit designs?',
      desc: 'No, signing up and submitting designs is entirely free.',
    },
    {
      title: 'How do I know if a design brief is right for me?',
      desc:
        'Each brief includes detailed style preferences, reference images, budget, and timelines. You can preview all briefs and apply only to those that match your skills or interest.',
    },
    {
      title: 'How long does it take for a design to be reviewed?',
      desc:
        'Designs are usually reviewed within 5–7 business days of submission. You’ll receive updates on your dashboard and via email once your design is reviewed or selected.',
    },
    {
      title: 'How is payment processed after selection?',
      desc:
        "Once your design is approved, payments are made directly to your registered bank or UPI account within 7 working days. You'll receive confirmation via email and your dashboard.",
    },
    {
      title: 'Is my personal information kept confidential?',
      desc:
        'Absolutely. We follow strict data privacy policies and your personal details are never shared with third parties without your consent.',
    },
    {
      title: 'What happens if two designers submit very similar designs?',
      desc:
        'The final selection is at the brand’s discretion. Similarities may occur, but only the design that best fits the brief’s vision will be selected and rewarded.',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: false }}
      className="w-full px-6 py-16 bg-[#ecf3f2] bg-gradient-to-br from-[#ecf3f2] via-white to-[#ecf3f2] flex justify-center"
    >
      <div className="w-full max-w-4xl ">
      <motion.div className="flex items-center gap-1 justify-center mb-3" >
                    <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
                    <div className="w-8.5 h-2.5 bg-black rounded-[25px]"></div>
        </motion.div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-center text-gray-800 mb-8 sm:mb-8 md:mb-10">
        Frequently Asked Questions
        </h2>


      
        <Accordion
        type="multiple"
        defaultValue={['item-0']}
        className="space-y-4"
        >
        {faqitems.map((item, idx) => {
            const Icon = iconMap[idx % iconMap.length];
            return (
            <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: false }}
            >
                <AccordionItem
                value={`item-${idx}`}
                className="bg-white shadow-md rounded-lg border border-gray-200 transition-all duration-300 cursor-pointer"
                >
                <AccordionTrigger className="flex items-center justify-between px-6 py-4 text-base font-medium text-gray-900 hover:bg-gray-50 transition-colors group">
                    <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-gray-500 group-hover:text-slate-900 transition-colors" />
                    <span className="text-sm sm:text-base">{item.title}</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pt-3 pb-5 text-sm text-gray-700 leading-relaxed">
                    {item.desc}
                </AccordionContent>
                </AccordionItem>
            </motion.div>
            );
        })}
        </Accordion>

      </div>
    </motion.div>
  )
}

export default DesignsFaq
