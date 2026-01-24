import React, { useState } from 'react';
import { Plus, Search, Filter, MoreVertical, Play, Download, Trash2, ExternalLink, MessageSquare, ShoppingCart, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Badge } from '../components/ui/badge';
import { mockStreams, mockOrders } from '../data/mockData';

const StreamsPage = () => {
  const [streams, setStreams] = useState(mockStreams);
  const [selectedStream, setSelectedStream] = useState(null);
  const [newStreamUrl, setNewStreamUrl] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStreams = streams.filter(stream =>
    stream.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddStream = () => {
    if (newStreamUrl) {
      const newStream = {
        id: streams.length + 1,
        title: `New Stream ${streams.length + 1}`,
        url: newStreamUrl,
        platform: 'facebook',
        date: new Date().toISOString().split('T')[0],
        status: 'processing',
        commentsCount: 0,
        ordersCount: 0,
        revenue: 0,
      };
      setStreams([newStream, ...streams]);
      setNewStreamUrl('');
      setIsAddDialogOpen(false);
    }
  };

  const handleDeleteStream = (id) => {
    setStreams(streams.filter(stream => stream.id !== id));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Completed</Badge>;
      case 'processing':
        return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Processing</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Failed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const streamOrders = selectedStream
    ? mockOrders.filter(order => order.streamId === selectedStream.id)
    : [];

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Streams</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your live stream recordings and orders</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Stream
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Stream</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Stream URL
                  </label>
                  <Input
                    placeholder="https://www.facebook.com/.../videos/..."
                    value={newStreamUrl}
                    onChange={(e) => setNewStreamUrl(e.target.value)}
                    className="w-full"
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Paste the URL of your Facebook, Instagram, or TikTok live stream video.
                </p>
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddStream} className="bg-emerald-500 hover:bg-emerald-600">
                    Add Stream
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search streams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white dark:bg-gray-800"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                <Play className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{streams.length}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Streams</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {streams.reduce((acc, s) => acc + s.commentsCount, 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Comments</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {streams.reduce((acc, s) => acc + s.ordersCount, 0)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Orders</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {streams.reduce((acc, s) => acc + s.revenue, 0).toLocaleString()} zł
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Revenue</p>
              </div>
            </div>
          </div>
        </div>

        {/* Streams Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Streams List */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Streams</h2>
            {filteredStreams.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border border-gray-100 dark:border-gray-700">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No streams yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">Add your first stream to get started</p>
                <Button onClick={() => setIsAddDialogOpen(true)} className="bg-emerald-500 hover:bg-emerald-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Stream
                </Button>
              </div>
            ) : (
              filteredStreams.map((stream) => (
                <div
                  key={stream.id}
                  onClick={() => setSelectedStream(stream)}
                  className={`bg-white dark:bg-gray-800 rounded-xl p-5 border cursor-pointer transition-all hover:shadow-md ${
                    selectedStream?.id === stream.id
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                      : 'border-gray-100 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{stream.title}</h3>
                        {getStatusBadge(stream.status)}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate mb-3">
                        {stream.url}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          <MessageSquare className="w-4 h-4 inline mr-1" />
                          {stream.commentsCount.toLocaleString()}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          <ShoppingCart className="w-4 h-4 inline mr-1" />
                          {stream.ordersCount}
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                          {stream.revenue.toLocaleString()} zł
                        </span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="shrink-0">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open URL
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Export to Excel
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteStream(stream.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-400">{stream.date}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Orders Panel */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Orders {selectedStream && `- ${selectedStream.title}`}
            </h2>
            {!selectedStream ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border border-gray-100 dark:border-gray-700">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Select a stream</h3>
                <p className="text-gray-500 dark:text-gray-400">Click on a stream to view its orders</p>
              </div>
            ) : streamOrders.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border border-gray-100 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400">No orders found for this stream</p>
              </div>
            ) : (
              <div className="space-y-3">
                {streamOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">{order.customerName}</h4>
                      <Badge
                        className={`text-xs ${
                          order.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : order.status === 'shipped'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 italic">
                      "{order.comment}"
                    </p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {order.products.map((product, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                        >
                          {product}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">{order.timestamp}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamsPage;
