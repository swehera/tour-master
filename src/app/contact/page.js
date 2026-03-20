'use client';
import { useState } from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input, { Textarea, Select } from '@/components/ui/Input';
import { useForm } from 'react-hook-form';
import { contactService } from '@/services/contact.service';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [sent,    setSent]    = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await contactService.submit(data);
      setSent(true);
      toast.success('Message sent! We\'ll get back to you within 24 hours.');
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contacts = [
    { icon: MapPin, label: 'Address',        value: '123 Travel Street, Dhaka 1212, Bangladesh' },
    { icon: Phone,  label: 'Phone',          value: '+880 17 0000 0000' },
    { icon: Mail,   label: 'Email',          value: 'hello@tourmaster.com' },
    { icon: Clock,  label: 'Business Hours', value: 'Mon–Fri: 9AM–6PM, Sat: 10AM–4PM' },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-16">
        <div className="bg-gradient-to-br from-sky-600 to-blue-800 py-16 text-center px-4">
          <h1 className="text-4xl font-bold text-white mb-3">Get In Touch</h1>
          <p className="text-sky-100 text-lg max-w-xl mx-auto">
            Have a question or want to plan your dream trip? We'd love to hear from you.
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-5">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Information</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                Our friendly team is always here to help. Reach out and we'll respond promptly.
              </p>
              <div className="space-y-3">
                {contacts.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-4 card p-4">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-900/20 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-sky-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="card p-8">
                {sent ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      Thank you for reaching out. We'll get back to you within 24 hours.
                    </p>
                    <Button onClick={() => setSent(false)}>Send Another Message</Button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Send Us a Message</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input label="Your Name *" placeholder="John Doe" error={errors.name?.message}
                          {...register('name', { required: 'Name is required' })} />
                        <Input label="Email Address *" type="email" placeholder="john@example.com" error={errors.email?.message}
                          {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })} />
                      </div>
                      <Input label="Phone Number" type="tel" placeholder="+880 17 0000 0000"
                        {...register('phone')} />
                      <Select label="Inquiry Type" {...register('type')}>
                        <option value="general">General Inquiry</option>
                        <option value="booking">Booking Help</option>
                        <option value="custom">Custom Tour Request</option>
                        <option value="complaint">Complaint / Feedback</option>
                        <option value="other">Other</option>
                      </Select>
                      <Textarea label="Message *" rows={5}
                        placeholder="Tell us about your travel plans or question…"
                        error={errors.message?.message}
                        {...register('message', { required: 'Message is required', minLength: { value: 10, message: 'Min 10 characters' } })} />
                      <Button type="submit" loading={loading} size="lg" className="w-full">
                        <Send className="w-4 h-4" /> Send Message
                      </Button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
