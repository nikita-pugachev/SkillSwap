import requestsReducer, {
  createRequest,
  acceptRequest,
  rejectRequest,
  completeRequest,
  SkillRequest,
} from './requestsSlice';

const STORAGE_KEY = 'skillswap_requests';

describe('requestsSlice', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('начальное состояние', () => {
    const state = requestsReducer(undefined, { type: 'unknown' });
    expect(state.requests).toEqual([]);
  });

  it('загружает заявки из localStorage при инициализации', () => {
    const existing: SkillRequest[] = [
      {
        id: 'req_123',
        skillId: 'skill_1',
        fromUserId: 'user_2',
        toUserId: 'user_1',
        status: 'pending',
        createdAt: '2025-03-20T10:00:00.000Z',
      },
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));

    const state = requestsReducer(undefined, { type: 'unknown' });

    expect(state.requests);
  });

  it('createRequest создаёт заявку со статусом pending и уникальным id', () => {
    const initialState = { requests: [] as SkillRequest[] };

    const result = requestsReducer(
      initialState,
      createRequest({
        skillId: 'skill_999',
        fromUserId: 'user_10',
        toUserId: 'user_20',
      })
    );

    expect(result.requests).toHaveLength(1);
    const req = result.requests[0];

    expect(req.id).toMatch(/^req_/);
    expect(req.status).toBe('pending');
    expect(req.skillId).toBe('skill_999');
    expect(req.fromUserId).toBe('user_10');
    expect(req.toUserId).toBe('user_20');
    expect(req.createdAt).toBeDefined();
  });

  it('acceptRequest меняет статус на accepted', () => {
    const request: SkillRequest = {
      id: 'req_test',
      skillId: 'skill_1',
      fromUserId: 'user_2',
      toUserId: 'user_1',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    let state = { requests: [request] };
    state = requestsReducer(state, acceptRequest('req_test'));

    expect(state.requests[0].status).toBe('accepted');
  });

  it('rejectRequest меняет статус на rejected', () => {
    const request: SkillRequest = {
      id: 'req_test',
      skillId: 'skill_1',
      fromUserId: 'user_2',
      toUserId: 'user_1',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    let state = { requests: [request] };
    state = requestsReducer(state, rejectRequest('req_test'));

    expect(state.requests[0].status).toBe('rejected');
  });

  it('completeRequest меняет статус на done', () => {
    const request: SkillRequest = {
      id: 'req_test',
      skillId: 'skill_1',
      fromUserId: 'user_2',
      toUserId: 'user_1',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    let state = { requests: [request] };
    state = requestsReducer(state, completeRequest('req_test'));

    expect(state.requests[0].status).toBe('done');
  });

  it('сохраняет данные в localStorage после каждого изменения', () => {
    const initialState = { requests: [] as SkillRequest[] };

    requestsReducer(
      initialState,
      createRequest({
        skillId: 'skill_555',
        fromUserId: 'user_a',
        toUserId: 'user_b',
      })
    );

    const saved = localStorage.getItem(STORAGE_KEY);
    expect(saved).not.toBeNull();
    expect(JSON.parse(saved!)).toHaveLength(1);
  });
});
