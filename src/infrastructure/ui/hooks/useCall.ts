import { useState, useEffect } from 'react';
import { Call } from '../../../core/domain/entities/Call';
import { container } from '../../DIContainer';

export const useCall = () => {
  const callService = container.getCallService();
  const [activeCall, setActiveCall] = useState<Call | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);

  const controls = callService.getControls();

  const receiveCall = async (phoneNumber: string, audioStreamUrl?: string) => {
    const call = await callService.receiveCall({
      id: Date.now().toString(),
      phoneNumber,
      audioStreamUrl,
    });
    setActiveCall(call);
    return call;
  };

  const mute = async () => {
    await controls.mute();
    setIsMuted(true);
  };

  const unmute = async () => {
    await controls.unmute();
    setIsMuted(false);
  };

  const hold = async () => {
    await controls.hold();
    setIsOnHold(true);
  };

  const resume = async () => {
    await controls.resume();
    setIsOnHold(false);
  };

  const hangup = async () => {
    await controls.hangup();
    setActiveCall(null);
    setIsMuted(false);
    setIsOnHold(false);
  };

  const transfer = async (targetNumber: string) => {
    await controls.transfer(targetNumber);
  };

  useEffect(() => {
    const current = callService.getActiveCall();
    setActiveCall(current);
  }, []);

  return {
    activeCall,
    isMuted,
    isOnHold,
    receiveCall,
    mute,
    unmute,
    hold,
    resume,
    hangup,
    transfer,
  };
};
