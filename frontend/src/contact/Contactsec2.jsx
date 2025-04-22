import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { backendurl } from '@/server';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' },
};

const Contactsec2 = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${backendurl}/usersupport/user-support/create`, data);
      toast.success("Your message has been sent! We'll get back to you soon.");
      reset();
    } catch (err) {
      toast.error("Something went wrong. Please try again later.");
      console.error(err);
    }
  };

  return (
    <div className="px-6 md:px-10 py-16 max-w-5xl mx-auto">
      <motion.div
        className="flex items-center gap-2 justify-center mb-4"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="w-2.5 h-2.5 bg-black rounded-full" />
        <div className="w-8 h-2.5 bg-black rounded-full" />
      </motion.div>

      <motion.div {...fadeInUp} viewport={{ once: true }}>
        <h1 className="text-center text-3xl md:text-4xl font-bold mb-2">Send us a message</h1>
        <p className="text-center text-muted-foreground mb-10">
          Have a question? We’re here to help. Send us a message and we’ll get back to you.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div {...fadeInUp} viewport={{ once: true }}>
            <Label className="mb-2">Name</Label>
            <Input {...register('name', { required: true })} placeholder="Your Name" />
            {errors.name && <span className="text-red-500 text-sm">Name is required</span>}
          </motion.div>

          <motion.div {...fadeInUp} viewport={{ once: true }}>
            <Label className="mb-2">Email</Label>
            <Input type="email" {...register('email', { required: true })} placeholder="you@example.com" />
            {errors.email && <span className="text-red-500 text-sm">Email is required</span>}
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div {...fadeInUp} viewport={{ once: true }}>
            <Label className="mb-2">Subject</Label>
            <Input {...register('subject', { required: true })} placeholder="Subject" />
            {errors.subject && <span className="text-red-500 text-sm">Subject is required</span>}
          </motion.div>

          <motion.div {...fadeInUp} viewport={{ once: true }}>
            <Label className="mb-2">Phone Number</Label>
            <Input type="tel" {...register('phone')} placeholder="Optional" />
          </motion.div>
        </div>

        <motion.div {...fadeInUp} viewport={{ once: true }}>
          <Label className="mb-2">Message</Label>
          <Textarea
            className="min-h-[110px] md:min-h-[110px]"
            {...register('message', { required: true })}
            placeholder="Your message..."
          />
          {errors.message && <span className="text-red-500 text-sm">Message is required</span>}
        </motion.div>

        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex justify-center mt-6">
          <Button
            type="submit"
            className="cursor-pointer px-8 py-3 rounded-full text-white bg-black hover:bg-transparent hover:text-black border border-black"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </motion.div>
      </form>
    </div>
  );
};

export default Contactsec2;
