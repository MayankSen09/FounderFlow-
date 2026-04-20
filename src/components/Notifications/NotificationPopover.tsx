import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Info, AlertTriangle, CheckCircle } from 'lucide-react';

interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    type: 'info' | 'success' | 'warning';
    read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        title: 'Funnel Generated',
        message: 'Your SaaS B2B Funnel strategy is ready for review.',
        time: '2 mins ago',
        type: 'success',
        read: false
    },
    {
        id: '2',
        title: 'System Update',
        message: 'New AI models have been integrated into the Playbook Wizard.',
        time: '1 hour ago',
        type: 'info',
        read: false
    },
    {
        id: '3',
        title: 'Subscription Alert',
        message: 'Your trial period is ending in 3 days.',
        time: '2 days ago',
        type: 'warning',
        read: true
    }
];

export const NotificationPopover = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleMarkAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const handleNotificationClick = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-tertiary hover:text-primary hover:bg-elevated rounded-lg relative transition-colors focus:outline-none"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 h-2 w-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-30"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface border border-default rounded-2xl shadow-xl z-40 overflow-hidden"
                        >
                            <div className="p-4 border-b border-default flex items-center justify-between bg-elevated/50 backdrop-blur-sm">
                                <h3 className="font-bold text-primary">Notifications</h3>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={handleMarkAllRead}
                                        className="text-xs font-semibold text-brand-primary hover:text-brand-secondary transition-colors"
                                    >
                                        Mark all as read
                                    </button>
                                )}
                            </div>

                            <div className="max-h-[400px] overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-tertiary">
                                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                        <p className="text-sm">No notifications</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-default">
                                        {notifications.map(notification => (
                                            <div
                                                key={notification.id}
                                                onClick={() => handleNotificationClick(notification.id)}
                                                className={`p-4 hover:bg-elevated transition-colors cursor-pointer flex gap-4 ${!notification.read ? 'bg-brand-primary/5' : ''}`}
                                            >
                                                <div className={`mt-1 p-1.5 rounded-full flex-shrink-0 ${notification.type === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                                                    notification.type === 'warning' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
                                                        'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                                    }`}>
                                                    {notification.type === 'success' && <CheckCircle className="w-4 h-4" />}
                                                    {notification.type === 'warning' && <AlertTriangle className="w-4 h-4" />}
                                                    {notification.type === 'info' && <Info className="w-4 h-4" />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <p className={`text-sm font-semibold truncate ${!notification.read ? 'text-primary' : 'text-secondary'}`}>
                                                            {notification.title}
                                                        </p>
                                                        <span className="text-[10px] text-tertiary whitespace-nowrap ml-2">
                                                            {notification.time}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-secondary line-clamp-2 leading-relaxed">
                                                        {notification.message}
                                                    </p>
                                                </div>
                                                {!notification.read && (
                                                    <div className="self-center">
                                                        <div className="w-2 h-2 rounded-full bg-brand-primary shadow-sm" />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="p-3 border-t border-default bg-elevated/30 text-center">
                                <button className="text-xs font-semibold text-tertiary hover:text-primary transition-colors">
                                    View archived notifications
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};
