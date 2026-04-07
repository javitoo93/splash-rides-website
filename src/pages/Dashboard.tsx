import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  IconButton,
  Avatar,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  AccountBalanceWallet,
  TrendingUp,
  TrendingDown,
  Send,
  RequestQuote,
  Add,
  ArrowForward,
  MoreVert,
  AttachMoney,
  Euro,
  CurrencyPound,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { format } from 'date-fns';
import { useAuthStore } from '@store/authStore';
import { useWalletStore } from '@store/walletStore';
import { getWalletBalance, getRecentTransactions, getSpendingAnalytics } from '@services/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { balance, fetchBalance } = useWalletStore();

  // Fetch wallet balance
  const { data: walletData, isLoading: balanceLoading } = useQuery({
    queryKey: ['wallet-balance'],
    queryFn: getWalletBalance,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch recent transactions
  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['recent-transactions'],
    queryFn: () => getRecentTransactions(5),
  });

  // Fetch spending analytics
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['spending-analytics'],
    queryFn: getSpendingAnalytics,
  });

  const quickActions = [
    {
      icon: <Send />,
      title: 'Send Money',
      description: 'Transfer to anyone',
      color: '#4caf50',
      action: () => navigate('/transfer'),
    },
    {
      icon: <RequestQuote />,
      title: 'Request Money',
      description: 'Get paid easily',
      color: '#2196f3',
      action: () => navigate('/transfer?tab=request'),
    },
    {
      icon: <Add />,
      title: 'Add Money',
      description: 'Top up wallet',
      color: '#ff9800',
      action: () => navigate('/wallet?action=deposit'),
    },
  ];

  const currencyBalances = [
    { currency: 'USD', symbol: <AttachMoney />, balance: walletData?.usd || 0, change: 2.5 },
    { currency: 'EUR', symbol: <Euro />, balance: walletData?.eur || 0, change: -1.2 },
    { currency: 'GBP', symbol: <CurrencyPound />, balance: walletData?.gbp || 0, change: 0.8 },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        {/* Welcome Section */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              sx={{
                p: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
              }}
            >
              <Typography variant="h4" gutterBottom>
                Welcome back, {user?.firstName}! 👋
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Your total balance across all currencies
              </Typography>
              <Typography variant="h2" sx={{ my: 2, fontWeight: 'bold' }}>
                $<CountUp end={walletData?.totalUSD || 0} duration={2} decimals={2} />
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="contained"
                    startIcon={action.icon}
                    onClick={action.action}
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.3)',
                      },
                    }}
                  >
                    {action.title}
                  </Button>
                ))}
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        {/* Currency Balances */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Currency Balances
            </Typography>
            <Grid container spacing={2}>
              {currencyBalances.map((item, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar sx={{ bgcolor: COLORS[index], mr: 1 }}>
                          {item.symbol}
                        </Avatar>
                        <Typography variant="h6">{item.currency}</Typography>
                      </Box>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        <CountUp end={item.balance} duration={2} decimals={2} />
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        {item.change > 0 ? (
                          <TrendingUp color="success" fontSize="small" />
                        ) : (
                          <TrendingDown color="error" fontSize="small" />
                        )}
                        <Typography
                          variant="body2"
                          color={item.change > 0 ? 'success.main' : 'error.main'}
                          sx={{ ml: 0.5 }}
                        >
                          {Math.abs(item.change)}%
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            {quickActions.map((action, index) => (
              <Card
                key={index}
                sx={{
                  mb: 2,
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateX(8px)',
                  },
                }}
                onClick={action.action}
              >
                <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: action.color, mr: 2 }}>
                    {action.icon}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1">{action.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {action.description}
                    </Typography>
                  </Box>
                  <ArrowForward color="action" />
                </CardContent>
              </Card>
            ))}
          </Paper>
        </Grid>

        {/* Recent Transactions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Recent Transactions</Typography>
              <Button size="small" onClick={() => navigate('/transactions')}>
                View All
              </Button>
            </Box>
            {transactionsLoading ? (
              <LinearProgress />
            ) : (
              <Box>
                {transactions?.map((transaction: any) => (
                  <Box
                    key={transaction.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      py: 2,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      '&:last-child': {
                        borderBottom: 'none',
                      },
                    }}
                  >
                    <Avatar sx={{ mr: 2, bgcolor: transaction.type === 'credit' ? 'success.main' : 'error.main' }}>
                      {transaction.type === 'credit' ? <TrendingUp /> : <TrendingDown />}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2">
                        {transaction.description}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {format(new Date(transaction.createdAt), 'MMM dd, yyyy HH:mm')}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography
                        variant="subtitle1"
                        color={transaction.type === 'credit' ? 'success.main' : 'error.main'}
                        sx={{ fontWeight: 'bold' }}
                      >
                        {transaction.type === 'credit' ? '+' : '-'}
                        {transaction.currency} {transaction.amount}
                      </Typography>
                      <Chip
                        label={transaction.status}
                        size="small"
                        color={
                          transaction.status === 'completed'
                            ? 'success'
                            : transaction.status === 'pending'
                            ? 'warning'
                            : 'error'
                        }
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Spending Analytics */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Spending Analytics
            </Typography>
            {analyticsLoading ? (
              <LinearProgress />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics?.categories || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analytics?.categories?.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>

        {/* Transaction Volume Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Transaction Volume (Last 30 Days)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics?.dailyVolume || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="sent"
                  stackId="1"
                  stroke="#8884d8"
                  fill="#8884d8"
                />
                <Area
                  type="monotone"
                  dataKey="received"
                  stackId="1"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
